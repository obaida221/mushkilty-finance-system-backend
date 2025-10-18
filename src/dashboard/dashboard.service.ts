import { Injectable } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { ExpenseService } from '../expense/expense.service';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { CourseService } from '../course/course.service';
import { StudentService } from '../student/student.service';
import { PaymentMethodService } from '../payment-method/payment-method.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly expenseService: ExpenseService,
    private readonly enrollmentService: EnrollmentService,
    private readonly courseService: CourseService,
    private readonly studentService: StudentService,
    private readonly paymentMethodService: PaymentMethodService,
  ) {}

  async getStats() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Get current month totals
    const totalIncome = await this.paymentService.getTotalByMonth(currentYear, currentMonth);
    const totalExpenses = await this.expenseService.getTotalByMonth(currentYear, currentMonth);

    // Get last month totals for comparison
    const prevIncome = await this.paymentService.getTotalByMonth(lastMonthYear, lastMonth);
    const prevExpenses = await this.expenseService.getTotalByMonth(lastMonthYear, lastMonth);

    // Get active students
    const currentStudents = await this.enrollmentService.getActiveStudentsCount();
    const prevStudents = await this.enrollmentService.getActiveStudentsCountByMonth(lastMonthYear, lastMonth);

    const netProfit = totalIncome - totalExpenses;
    const prevProfit = prevIncome - prevExpenses;

    // Calculate percentage changes
    const incomeChange = prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome * 100).toFixed(1) : '0.0';
    const expensesChange = prevExpenses > 0 ? ((totalExpenses - prevExpenses) / prevExpenses * 100).toFixed(1) : '0.0';
    const profitChange = prevProfit > 0 ? ((netProfit - prevProfit) / prevProfit * 100).toFixed(1) : '0.0';
    const studentsChange = prevStudents > 0 ? ((currentStudents - prevStudents) / prevStudents * 100).toFixed(1) : '0.0';

    return {
      totalIncome,
      totalExpenses,
      activeStudents: currentStudents,
      netProfit,
      incomeChange: `${parseFloat(incomeChange) >= 0 ? '+' : ''}${incomeChange}%`,
      expensesChange: `${parseFloat(expensesChange) >= 0 ? '+' : ''}${expensesChange}%`,
      profitChange: `${parseFloat(profitChange) >= 0 ? '+' : ''}${profitChange}%`,
      studentsChange: `${parseFloat(studentsChange) >= 0 ? '+' : ''}${studentsChange}%`,
    };
  }

  async getRevenueChart(months: number = 6) {
    const incomeData = await this.paymentService.getRevenueChartData(months);
    const expenseData = await this.expenseService.getExpenseChartData(months);

    // Combine income and expense data
    return incomeData.map((income, index) => ({
      month: income.month,
      income: income.income,
      expenses: expenseData[index]?.expenses || 0,
    }));
  }

  async getStudentEnrollmentChart(months: number = 6) {
    return this.enrollmentService.getEnrollmentChartData(months);
  }

  async getCourseDistributionChart() {
    return this.courseService.getCourseDistribution();
  }

  async getPaymentMethodChart(months: number = 6) {
    return this.paymentService.getPaymentMethodDistribution(months);
  }

  async getFinancialSummary(year: number) {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59);

    // Total income and expenses for the year
    const totalIncome = await this.paymentService.getTotalByDateRange(yearStart, yearEnd);
    const totalExpenses = await this.expenseService.getTotalByDateRange(yearStart, yearEnd);

    // Monthly breakdown
    const monthlyBreakdown: Array<{month: number, income: number, expenses: number, profit: number}> = [];
    for (let month = 1; month <= 12; month++) {
      const monthIncome = await this.paymentService.getTotalByMonth(year, month);
      const monthExpenses = await this.expenseService.getTotalByMonth(year, month);

      monthlyBreakdown.push({
        month,
        income: monthIncome,
        expenses: monthExpenses,
        profit: monthIncome - monthExpenses,
      });
    }

    return {
      year,
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      monthlyBreakdown,
    };
  }

  async getRecentActivities(limit: number = 10) {
    // Get recent data from each service
    const recentPayments = await this.paymentService.getRecentPayments(Math.ceil(limit / 2));
    const recentEnrollments = await this.enrollmentService.getRecentEnrollments(Math.ceil(limit / 2));
    const recentExpenses = await this.expenseService.getRecentExpenses(Math.ceil(limit / 3));

    // Combine and sort all activities
    const activities = [
      ...recentPayments.map(payment => ({
        type: 'payment',
        id: payment.id,
        date: payment.paid_at,
        description: `دفعة من ${payment.enrollment?.student?.full_name || payment.payer}`,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.paymentMethod?.name,
      })),
      ...recentEnrollments.map(enrollment => ({
        type: 'enrollment',
        id: enrollment.id,
        date: enrollment.enrolled_at,
        description: `تسجيل ${enrollment.student?.full_name} في ${enrollment.batch?.course?.name}`,
        status: enrollment.status,
        batch: enrollment.batch?.name,
      })),
      ...recentExpenses.map(expense => ({
        type: 'expense',
        id: expense.id,
        date: expense.expense_date,
        description: `مصروف لـ ${expense.beneficiary}`,
        amount: expense.amount,
        currency: expense.currency,
      })),
    ];

    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
}