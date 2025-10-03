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
import { RefundService } from './refund.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { UpdateRefundDto } from './dto/update-refund.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('refunds')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('refunds')
export class RefundController {
  constructor(private readonly service: RefundService) {}

  @Post()
  @Permissions('refund:create')
  @ApiOperation({ summary: 'Create a new refund' })
  @ApiResponse({ status: 201, description: 'The refund has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createDto: CreateRefundDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('refund:read')
  @ApiOperation({ summary: 'Get all refunds' })
  @ApiResponse({ status: 200, description: 'Return all refunds.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.service.findAll();
  }

  @Get('search/payment/:paymentId')
  @Permissions('refund:read')
  @ApiOperation({ summary: 'Find refunds by payment' })
  @ApiResponse({ status: 200, description: 'Return refunds for the specified payment.' })
  findByPayment(@Param('paymentId') paymentId: string) {
    return this.service.findByPayment(+paymentId);
  }

  @Get('search/date-range')
  @Permissions('refund:read')
  @ApiOperation({ summary: 'Find refunds by date range' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Return refunds within the specified date range.' })
  findByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.findByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get('totals/payment/:paymentId')
  @Permissions('refund:read')
  @ApiOperation({ summary: 'Get total refunds by payment' })
  @ApiResponse({ status: 200, description: 'Return total refunds for the payment.' })
  getTotalRefundsByPayment(@Param('paymentId') paymentId: string) {
    return this.service.getTotalRefundsByPayment(+paymentId);
  }

  @Get('totals/date-range')
  @Permissions('refund:read')
  @ApiOperation({ summary: 'Get total refunds by date range' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Return total refunds within the date range.' })
  getTotalRefundsByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.getTotalRefundsByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  @Permissions('refund:read')
  @ApiOperation({ summary: 'Get a refund by id' })
  @ApiResponse({ status: 200, description: 'Return the refund.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('refund:update')
  @ApiOperation({ summary: 'Update a refund' })
  @ApiResponse({ status: 200, description: 'The refund has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateDto: UpdateRefundDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @Permissions('refund:delete')
  @ApiOperation({ summary: 'Delete a refund' })
  @ApiResponse({ status: 200, description: 'The refund has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
