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
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('expenses')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly service: ExpenseService) {}

  @Post()
  @Permissions('expense:create')
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'The expense has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createDto: CreateExpenseDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('expense:read')
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({ status: 200, description: 'Return all expenses.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.service.findAll();
  }

  @Get('search/user/:userId')
  @Permissions('expense:read')
  @ApiOperation({ summary: 'Find expenses by user' })
  @ApiResponse({ status: 200, description: 'Return expenses for the specified user.' })
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(+userId);
  }

  @Get('search/category')
  @Permissions('expense:read')
  @ApiOperation({ summary: 'Find expenses by category' })
  @ApiQuery({ name: 'category', required: true, description: 'Expense category' })
  @ApiResponse({ status: 200, description: 'Return expenses for the specified category.' })
  findByCategory(@Query('category') category: string) {
    return this.service.findByCategory(category);
  }

  @Get('search/date-range')
  @Permissions('expense:read')
  @ApiOperation({ summary: 'Find expenses by date range' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Return expenses within the specified date range.' })
  findByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.findByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get('totals/user/:userId')
  @Permissions('expense:read')
  @ApiOperation({ summary: 'Get total expenses by user' })
  @ApiResponse({ status: 200, description: 'Return total expenses for the user.' })
  getTotalExpensesByUser(@Param('userId') userId: string) {
    return this.service.getTotalExpensesByUser(+userId);
  }

  @Get('totals/category')
  @Permissions('expense:read')
  @ApiOperation({ summary: 'Get total expenses by category' })
  @ApiQuery({ name: 'category', required: true, description: 'Expense category' })
  @ApiResponse({ status: 200, description: 'Return total expenses for the category.' })
  getTotalExpensesByCategory(@Query('category') category: string) {
    return this.service.getTotalExpensesByCategory(category);
  }

  @Get('totals/date-range')
  @Permissions('expense:read')
  @ApiOperation({ summary: 'Get total expenses by date range' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Return total expenses within the date range.' })
  getTotalExpensesByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.getTotalExpensesByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  @Permissions('expense:read')
  @ApiOperation({ summary: 'Get an expense by id' })
  @ApiResponse({ status: 200, description: 'Return the expense.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('expense:update')
  @ApiOperation({ summary: 'Update an expense' })
  @ApiResponse({ status: 200, description: 'The expense has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateDto: UpdateExpenseDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @Permissions('expense:delete')
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiResponse({ status: 200, description: 'The expense has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
