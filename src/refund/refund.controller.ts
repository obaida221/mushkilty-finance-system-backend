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
  @Permissions('refunds:create')
  @ApiOperation({ summary: 'Create a new refund' })
  @ApiResponse({ status: 201, description: 'The refund has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createDto: CreateRefundDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('refunds:read')
  @ApiOperation({ summary: 'Get all refunds' })
  @ApiResponse({ status: 200, description: 'Return all refunds.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions('refunds:read')
  @ApiOperation({ summary: 'Get a refund by id' })
  @ApiResponse({ status: 200, description: 'Return the refund.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('refunds:update')
  @ApiOperation({ summary: 'Update a refund' })
  @ApiResponse({ status: 200, description: 'The refund has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateDto: UpdateRefundDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @Permissions('refunds:delete')
  @ApiOperation({ summary: 'Delete a refund' })
  @ApiResponse({ status: 200, description: 'The refund has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

