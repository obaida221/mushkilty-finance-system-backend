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
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('enrollments')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly service: EnrollmentService) {}

  @Post()
  @Permissions('enrollments:create')
  @ApiOperation({ summary: 'Create a new enrollment' })
  @ApiResponse({ status: 201, description: 'The enrollment has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createDto: CreateEnrollmentDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('enrollments:read')
  @ApiOperation({ summary: 'Get all enrollments' })
  @ApiResponse({ status: 200, description: 'Return all enrollments.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.service.findAll();
  }

  @Get('active')
  @Permissions('enrollments:read')
  @ApiOperation({ summary: 'Get all active enrollments' })
  @ApiResponse({ status: 200, description: 'Return all active enrollments.' })
  findActiveEnrollments() {
    return this.service.findActiveEnrollments();
  }

  @Get('search/student/:studentId')
  @Permissions('enrollments:read')
  @ApiOperation({ summary: 'Find enrollments by student' })
  @ApiResponse({ status: 200, description: 'Return enrollments for the specified student.' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.service.findByStudent(+studentId);
  }

  @Get('search/batch/:batchId')
  @Permissions('enrollments:read')
  @ApiOperation({ summary: 'Find enrollments by batch' })
  @ApiResponse({ status: 200, description: 'Return enrollments for the specified batch.' })
  findByBatch(@Param('batchId') batchId: string) {
    return this.service.findByBatch(+batchId);
  }

  @Get('search/status')
  @Permissions('enrollments:read')
  @ApiOperation({ summary: 'Find enrollments by status' })
  @ApiQuery({ name: 'status', required: true, description: 'Enrollment status' })
  @ApiResponse({ status: 200, description: 'Return enrollments with the specified status.' })
  findByStatus(@Query('status') status: string) {
    return this.service.findByStatus(status);
  }

  @Get(':id')
  @Permissions('enrollments:read')
  @ApiOperation({ summary: 'Get an enrollment by id' })
  @ApiResponse({ status: 200, description: 'Return the enrollment.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('enrollments:update')
  @ApiOperation({ summary: 'Update an enrollment' })
  @ApiResponse({ status: 200, description: 'The enrollment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateDto: UpdateEnrollmentDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @Permissions('enrollments:delete')
  @ApiOperation({ summary: 'Delete an enrollment' })
  @ApiResponse({ status: 200, description: 'The enrollment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

