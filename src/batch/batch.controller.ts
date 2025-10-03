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
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('batches')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('batches')
export class BatchController {
  constructor(private readonly service: BatchService) {}

  @Post()
  @Permissions('batch:create')
  @ApiOperation({ summary: 'Create a new batch' })
  @ApiResponse({ status: 201, description: 'The batch has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createDto: CreateBatchDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('batch:read')
  @ApiOperation({ summary: 'Get all batches' })
  @ApiResponse({ status: 200, description: 'Return all batches.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.service.findAll();
  }

  @Get('active')
  @Permissions('batch:read')
  @ApiOperation({ summary: 'Get all active batches' })
  @ApiResponse({ status: 200, description: 'Return all active batches.' })
  findActiveBatches() {
    return this.service.findActiveBatches();
  }

  @Get('search/course/:courseId')
  @Permissions('batch:read')
  @ApiOperation({ summary: 'Find batches by course' })
  @ApiResponse({ status: 200, description: 'Return batches for the specified course.' })
  findByCourse(@Param('courseId') courseId: string) {
    return this.service.findByCourse(+courseId);
  }

  @Get('search/name')
  @Permissions('batch:read')
  @ApiOperation({ summary: 'Find batches by name' })
  @ApiQuery({ name: 'name', required: true, description: 'Batch name' })
  @ApiResponse({ status: 200, description: 'Return batches with the specified name.' })
  findByName(@Query('name') name: string) {
    return this.service.findByName(name);
  }

  @Get(':id')
  @Permissions('batch:read')
  @ApiOperation({ summary: 'Get a batch by id' })
  @ApiResponse({ status: 200, description: 'Return the batch.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('batch:update')
  @ApiOperation({ summary: 'Update a batch' })
  @ApiResponse({ status: 200, description: 'The batch has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateDto: UpdateBatchDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @Permissions('batch:delete')
  @ApiOperation({ summary: 'Delete a batch' })
  @ApiResponse({ status: 200, description: 'The batch has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
