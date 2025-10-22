import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('dashboard')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Permissions('dashboard:read')
  @ApiOperation({
    summary: 'Get dashboard statistics',
    description:
      'Get total income, expenses, active students, and net profit statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalIncome: { type: 'number', example: 67000 },
        totalExpenses: { type: 'number', example: 38000 },
        activeStudents: { type: 'number', example: 67 },
        netProfit: { type: 'number', example: 29000 },
        incomeChange: { type: 'string', example: '+12.5%' },
        expensesChange: { type: 'string', example: '+8.2%' },
        studentsChange: { type: 'string', example: '+15.8%' },
        profitChange: { type: 'string', example: '+18.3%' },
      },
    },
  })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('revenue-chart')
  @Permissions('dashboard:read')
  @ApiOperation({
    summary: 'Get revenue chart data',
    description: 'Get monthly income and expenses data for charts',
  })
  @ApiQuery({
    name: 'months',
    required: false,
    description: 'Number of months to include (default: 6)',
    example: 6,
  })
  @ApiResponse({
    status: 200,
    description: 'Revenue chart data retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          month: { type: 'string', example: 'يناير' },
          income: { type: 'number', example: 45000 },
          expenses: { type: 'number', example: 28000 },
        },
      },
    },
  })
  async getRevenueChart(@Query('months') months?: number) {
    return this.dashboardService.getRevenueChart(months || 6);
  }

  @Get('student-enrollment-chart')
  @Permissions('dashboard:read')
  @ApiOperation({
    summary: 'Get student enrollment chart data',
    description: 'Get monthly student enrollment data',
  })
  @ApiQuery({
    name: 'months',
    required: false,
    description: 'Number of months to include (default: 6)',
    example: 6,
  })
  @ApiResponse({
    status: 200,
    description: 'Student enrollment chart data retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          month: { type: 'string', example: 'يناير' },
          students: { type: 'number', example: 45 },
        },
      },
    },
  })
  async getStudentEnrollmentChart(@Query('months') months?: number) {
    return this.dashboardService.getStudentEnrollmentChart(months || 6);
  }

  @Get('course-distribution-chart')
  @Permissions('dashboard:read')
  @ApiOperation({
    summary: 'Get course distribution chart data',
    description: 'Get distribution of courses by project type',
  })
  @ApiResponse({
    status: 200,
    description: 'Course distribution chart data retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'أونلاين' },
          value: { type: 'number', example: 40 },
          color: { type: 'string', example: '#DC2626' },
        },
      },
    },
  })
  async getCourseDistributionChart() {
    return this.dashboardService.getCourseDistributionChart();
  }

  @Get('payment-method-chart')
  @Permissions('dashboard:read')
  @ApiOperation({
    summary: 'Get payment method chart data',
    description: 'Get payment amounts by payment method',
  })
  @ApiQuery({
    name: 'months',
    required: false,
    description: 'Number of months to include (default: 6)',
    example: 6,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method chart data retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          method: { type: 'string', example: 'نقدي' },
          amount: { type: 'number', example: 45000 },
        },
      },
    },
  })
  async getPaymentMethodChart(@Query('months') months?: number) {
    return this.dashboardService.getPaymentMethodChart(months || 6);
  }

  @Get('financial-summary')
  @Permissions('dashboard:read')
  @ApiOperation({
    summary: 'Get comprehensive financial summary',
    description:
      'Get detailed financial breakdown including payments, expenses, and trends',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Year for the summary (default: current year)',
    example: 2025,
  })
  @ApiResponse({
    status: 200,
    description: 'Financial summary retrieved successfully',
  })
  async getFinancialSummary(@Query('year') year?: number) {
    return this.dashboardService.getFinancialSummary(
      year || new Date().getFullYear(),
    );
  }

  @Get('recent-activities')
  @Permissions('dashboard:read')
  @ApiOperation({
    summary: 'Get recent activities',
    description:
      'Get recent payments, enrollments, and expenses for dashboard activity feed',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of activities to return (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Recent activities retrieved successfully',
  })
  async getRecentActivities(@Query('limit') limit?: number) {
    return this.dashboardService.getRecentActivities(limit || 10);
  }
}
