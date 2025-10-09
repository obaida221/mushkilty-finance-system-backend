import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { Expense } from '../expense/entities/expense.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Course } from '../course/entities/course.entity';
import { Student } from '../student/entities/student.entity';
import { PaymentMethod } from '../payment-method/entities/payment-method.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async getStats() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Get current month totals
    const currentMonthIncome = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('EXTRACT(YEAR FROM payment.paid_at) = :year', { year: currentYear })
      .andWhere('EXTRACT(MONTH FROM payment.paid_at) = :month', { month: currentMonth })
      .getRawOne();

    const currentMonthExpenses = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('EXTRACT(YEAR FROM expense.expense_date) = :year', { year: currentYear })
      .andWhere('EXTRACT(MONTH FROM expense.expense_date) = :month', { month: currentMonth })
      .getRawOne();

    // Get last month totals for comparison
    const lastMonthIncome = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('EXTRACT(YEAR FROM payment.paid_at) = :year', { year: lastMonthYear })
      .andWhere('EXTRACT(MONTH FROM payment.paid_at) = :month', { month: lastMonth })
      .getRawOne();

    const lastMonthExpenses = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('EXTRACT(YEAR FROM expense.expense_date) = :year', { year: lastMonthYear })
      .andWhere('EXTRACT(MONTH FROM expense.expense_date) = :month', { month: lastMonth })
      .getRawOne();

    // Get active students (students with active enrollments)
    const activeStudents = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .select('COUNT(DISTINCT enrollment.student_id)', 'count')
      .where('enrollment.status IN (:...statuses)', { statuses: ['pending', 'accepted'] })
      .getRawOne();

    const lastMonthActiveStudents = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .select('COUNT(DISTINCT enrollment.student_id)', 'count')
      .where('enrollment.status IN (:...statuses)', { statuses: ['pending', 'accepted'] })
      .andWhere('EXTRACT(YEAR FROM enrollment.enrolled_at) = :year', { year: lastMonthYear })
      .andWhere('EXTRACT(MONTH FROM enrollment.enrolled_at) = :month', { month: lastMonth })
      .getRawOne();

    const totalIncome = parseFloat(currentMonthIncome?.total || 0);
    const totalExpenses = parseFloat(currentMonthExpenses?.total || 0);
    const netProfit = totalIncome - totalExpenses;

    const prevIncome = parseFloat(lastMonthIncome?.total || 0);
    const prevExpenses = parseFloat(lastMonthExpenses?.total || 0);
    const prevProfit = prevIncome - prevExpenses;

    const currentStudents = parseInt(activeStudents?.count || 0);
    const prevStudents = parseInt(lastMonthActiveStudents?.count || 0);

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
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    const result: Array<{month: string, income: number, expenses: number}> = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const income = await this.paymentRepository
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'total')
        .where('EXTRACT(YEAR FROM payment.paid_at) = :year', { year })
        .andWhere('EXTRACT(MONTH FROM payment.paid_at) = :month', { month })
        .getRawOne();

      const expenses = await this.expenseRepository
        .createQueryBuilder('expense')
        .select('SUM(expense.amount)', 'total')
        .where('EXTRACT(YEAR FROM expense.expense_date) = :year', { year })
        .andWhere('EXTRACT(MONTH FROM expense.expense_date) = :month', { month })
        .getRawOne();

      result.push({
        month: monthNames[date.getMonth()],
        income: parseFloat(income?.total || 0),
        expenses: parseFloat(expenses?.total || 0),
      });
    }

    return result;
  }

  async getStudentEnrollmentChart(months: number = 6) {
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    const result: Array<{month: string, students: number}> = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const enrollments = await this.enrollmentRepository
        .createQueryBuilder('enrollment')
        .select('COUNT(*)', 'count')
        .where('EXTRACT(YEAR FROM enrollment.enrolled_at) = :year', { year })
        .andWhere('EXTRACT(MONTH FROM enrollment.enrolled_at) = :month', { month })
        .getRawOne();

      result.push({
        month: monthNames[date.getMonth()],
        students: parseInt(enrollments?.count || 0),
      });
    }

    return result;
  }

  async getCourseDistributionChart() {
    const colors = {
      'online': '#DC2626',
      'onsite': '#F59E0B',
      'kids': '#10B981',
      'ielts': '#3B82F6',
    };

    const arabicNames = {
      'online': 'أونلاين',
      'onsite': 'حضوري',
      'kids': 'كيدز',
      'ielts': 'آيلتس',
    };

    const distribution = await this.courseRepository
      .createQueryBuilder('course')
      .select('course.project_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('course.project_type IS NOT NULL')
      .groupBy('course.project_type')
      .getRawMany();

    return distribution.map(item => ({
      name: arabicNames[item.type] || item.type,
      value: parseInt(item.count),
      color: colors[item.type] || '#6B7280',
    }));
  }

  async getPaymentMethodChart(months: number = 6) {
    const arabicNames = {
      'cash': 'نقدي',
      'card': 'ماستر',
      'transfer': 'زين كاش',
      'bank': 'آسيا حوالة',
    };

    const currentDate = new Date();
    const fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - months + 1, 1);

    const paymentMethods = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoin('payment.paymentMethod', 'paymentMethod')
      .select('paymentMethod.name', 'method')
      .addSelect('SUM(payment.amount)', 'total')
      .where('payment.paid_at >= :fromDate', { fromDate })
      .groupBy('paymentMethod.name')
      .orderBy('total', 'DESC')
      .getRawMany();

    return paymentMethods.map(item => ({
      method: arabicNames[item.method] || item.method || 'غير محدد',
      amount: parseFloat(item.total || 0),
    }));
  }

  async getFinancialSummary(year: number) {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59);

    // Total income and expenses for the year
    const totalIncome = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.paid_at BETWEEN :start AND :end', { start: yearStart, end: yearEnd })
      .getRawOne();

    const totalExpenses = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.expense_date BETWEEN :start AND :end', { start: yearStart, end: yearEnd })
      .getRawOne();

    // Monthly breakdown
    const monthlyBreakdown: Array<{month: number, income: number, expenses: number, profit: number}> = [];
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);

      const monthIncome = await this.paymentRepository
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'total')
        .where('payment.paid_at BETWEEN :start AND :end', { start: monthStart, end: monthEnd })
        .getRawOne();

      const monthExpenses = await this.expenseRepository
        .createQueryBuilder('expense')
        .select('SUM(expense.amount)', 'total')
        .where('expense.expense_date BETWEEN :start AND :end', { start: monthStart, end: monthEnd })
        .getRawOne();

      monthlyBreakdown.push({
        month: month + 1,
        income: parseFloat(monthIncome?.total || 0),
        expenses: parseFloat(monthExpenses?.total || 0),
        profit: parseFloat(monthIncome?.total || 0) - parseFloat(monthExpenses?.total || 0),
      });
    }

    // Expense categories breakdown
    const expenseCategories = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('expense.category', 'category')
      .addSelect('SUM(expense.amount)', 'total')
      .where('expense.expense_date BETWEEN :start AND :end', { start: yearStart, end: yearEnd })
      .andWhere('expense.category IS NOT NULL')
      .groupBy('expense.category')
      .orderBy('total', 'DESC')
      .getRawMany();

    return {
      year,
      totalIncome: parseFloat(totalIncome?.total || 0),
      totalExpenses: parseFloat(totalExpenses?.total || 0),
      netProfit: parseFloat(totalIncome?.total || 0) - parseFloat(totalExpenses?.total || 0),
      monthlyBreakdown,
      expenseCategories: expenseCategories.map(cat => ({
        category: cat.category,
        amount: parseFloat(cat.total),
      })),
    };
  }

  async getRecentActivities(limit: number = 10) {
    // Recent payments
    const recentPayments = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.enrollment', 'enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('payment.paymentMethod', 'paymentMethod')
      .select([
        'payment.id',
        'payment.amount',
        'payment.currency',
        'payment.paid_at',
        'payment.payer',
        'student.name',
        'paymentMethod.name'
      ])
      .orderBy('payment.paid_at', 'DESC')
      .limit(Math.ceil(limit / 2))
      .getMany();

    // Recent enrollments
    const recentEnrollments = await this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('enrollment.batch', 'batch')
      .leftJoinAndSelect('batch.course', 'course')
      .select([
        'enrollment.id',
        'enrollment.enrolled_at',
        'enrollment.status',
        'student.name',
        'course.name',
        'batch.name'
      ])
      .orderBy('enrollment.enrolled_at', 'DESC')
      .limit(Math.ceil(limit / 2))
      .getMany();

    // Recent expenses
    const recentExpenses = await this.expenseRepository
      .createQueryBuilder('expense')
      .select([
        'expense.id',
        'expense.beneficiary',
        'expense.amount',
        'expense.currency',
        'expense.category',
        'expense.expense_date'
      ])
      .orderBy('expense.expense_date', 'DESC')
      .limit(Math.ceil(limit / 3))
      .getMany();

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
        category: expense.category,
      })),
    ];

    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
}