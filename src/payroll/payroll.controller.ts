import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('payrolls')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('payrolls')
export class PayrollController {
  constructor(private readonly service: PayrollService) {}

  @Post()
  @Permissions('payrolls:create')
  @ApiOperation({ summary: 'Create a new payroll' })
  @ApiResponse({ status: 201, description: 'The payroll has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createDto: CreatePayrollDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('payrolls:read')
  @ApiOperation({ summary: 'Get all payrolls' })
  @ApiResponse({ status: 200, description: 'Return all payrolls.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('payrolls:read')
  @ApiOperation({ summary: 'Get a payroll by id' })
  @ApiResponse({ status: 200, description: 'Return the payroll.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('payrolls:update')
  @ApiOperation({ summary: 'Update a payroll' })
  @ApiResponse({ status: 200, description: 'The payroll has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePayrollDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @Permissions('payrolls:delete')
  @ApiOperation({ summary: 'Delete a payroll' })
  @ApiResponse({ status: 200, description: 'The payroll has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

