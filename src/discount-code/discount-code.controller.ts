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
import { DiscountCodeService } from './discount-code.service';
import { CreateDiscountCodeDto } from './dto/create-discount-code.dto';
import { UpdateDiscountCodeDto } from './dto/update-discount-code.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('discount-codes')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('discount-codes')
export class DiscountCodeController {
  constructor(private readonly service: DiscountCodeService) {}

  @Post()
  @Permissions('discount-code:create')
  @ApiOperation({ summary: 'Create a new discount code' })
  @ApiResponse({ status: 201, description: 'The discount code has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createDto: CreateDiscountCodeDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('discount-code:read')
  @ApiOperation({ summary: 'Get all discount codes' })
  @ApiResponse({ status: 200, description: 'Return all discount codes.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.service.findAll();
  }

  @Get('active')
  @Permissions('discount-code:read')
  @ApiOperation({ summary: 'Get all active discount codes' })
  @ApiResponse({ status: 200, description: 'Return all active discount codes.' })
  findActiveDiscounts() {
    return this.service.findActiveDiscounts();
  }

  @Post('validate')
  @Permissions('discount-code:read')
  @ApiOperation({ summary: 'Validate a discount code' })
  @ApiResponse({ status: 200, description: 'Discount code is valid.' })
  @ApiResponse({ status: 400, description: 'Discount code is invalid or expired.' })
  @ApiResponse({ status: 404, description: 'Discount code not found.' })
  validateCode(@Body('code') code: string) {
    return this.service.validateCode(code);
  }

  @Get('search/code/:code')
  @Permissions('discount-code:read')
  @ApiOperation({ summary: 'Find discount code by code' })
  @ApiResponse({ status: 200, description: 'Return the discount code.' })
  @ApiResponse({ status: 404, description: 'Discount code not found.' })
  findByCode(@Param('code') code: string) {
    return this.service.findByCode(code);
  }

  @Get(':id')
  @Permissions('discount-code:read')
  @ApiOperation({ summary: 'Get a discount code by id' })
  @ApiResponse({ status: 200, description: 'Return the discount code.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('discount-code:update')
  @ApiOperation({ summary: 'Update a discount code' })
  @ApiResponse({ status: 200, description: 'The discount code has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateDto: UpdateDiscountCodeDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @Permissions('discount-code:delete')
  @ApiOperation({ summary: 'Delete a discount code' })
  @ApiResponse({ status: 200, description: 'The discount code has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Patch(':id/increment-usage')
  @Permissions('discount-code:update')
  @ApiOperation({ summary: 'Increment usage count of a discount code' })
  @ApiResponse({ status: 200, description: 'Usage count incremented.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  incrementUsage(@Param('id') id: string) {
    return this.service.incrementUsage(+id);
  }
}
