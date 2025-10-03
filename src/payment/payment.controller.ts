import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('payments')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post()
  @Permissions('payment:create')
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'The payment has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createDto: CreatePaymentDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('payment:read')
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Return all payments.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.service.findAll();
  }

  @Get('search/student/:studentId')
  @Permissions('payment:read')
  @ApiOperation({ summary: 'Find payments by student' })
  @ApiResponse({ status: 200, description: 'Return payments for the specified student.' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.service.findByStudent(+studentId);
  }

  @Get('search/payment-method/:paymentMethodId')
  @Permissions('payment:read')
  @ApiOperation({ summary: 'Find payments by payment method' })
  @ApiResponse({ status: 200, description: 'Return payments for the specified payment method.' })
  findByPaymentMethod(@Param('paymentMethodId') paymentMethodId: string) {
    return this.service.findByPaymentMethod(+paymentMethodId);
  }

  @Get('search/date-range')
  @Permissions('payment:read')
  @ApiOperation({ summary: 'Find payments by date range' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Return payments within the specified date range.' })
  findByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.findByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get('totals/student/:studentId')
  @Permissions('payment:read')
  @ApiOperation({ summary: 'Get total payments by student' })
  @ApiResponse({ status: 200, description: 'Return total payments for the student.' })
  getTotalPaymentsByStudent(@Param('studentId') studentId: string) {
    return this.service.getTotalPaymentsByStudent(+studentId);
  }

  @Get('totals/date-range')
  @Permissions('payment:read')
  @ApiOperation({ summary: 'Get total payments by date range' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Return total payments within the date range.' })
  getTotalPaymentsByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.getTotalPaymentsByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  @Permissions('payment:read')
  @ApiOperation({ summary: 'Get a payment by id' })
  @ApiResponse({ status: 200, description: 'Return the payment.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('payment:update')
  @ApiOperation({ summary: 'Update a payment' })
  @ApiResponse({ status: 200, description: 'The payment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePaymentDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @Permissions('payment:delete')
  @ApiOperation({ summary: 'Delete a payment' })
  @ApiResponse({ status: 200, description: 'The payment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
