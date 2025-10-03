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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('students')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('students')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Post()
  @Permissions('students:create')
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'The student has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createDto: CreateStudentDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Permissions('students:read')
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({ status: 200, description: 'Return all students.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.service.findAll();
  }

  @Get('search/phone/:phone')
  @Permissions('students:search')
  @ApiOperation({ summary: 'Find student by phone number' })
  @ApiResponse({ status: 200, description: 'Return the student.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  findByPhone(@Param('phone') phone: string) {
    return this.service.findByPhone(phone);
  }

  @Get('search/status')
  @Permissions('students:search')
  @ApiOperation({ summary: 'Find students by status' })
  @ApiQuery({ name: 'status', required: true, description: 'Student status' })
  @ApiResponse({ status: 200, description: 'Return students with the specified status.' })
  findByStatus(@Query('status') status: string) {
    return this.service.findByStatus(status);
  }

  @Get(':id')
  @Permissions('students:read')
  @ApiOperation({ summary: 'Get a student by id' })
  @ApiResponse({ status: 200, description: 'Return the student.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Permissions('students:update')
  @ApiOperation({ summary: 'Update a student' })
  @ApiResponse({ status: 200, description: 'The student has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateDto: UpdateStudentDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @Permissions('students:delete')
  @ApiOperation({ summary: 'Delete a student' })
  @ApiResponse({ status: 200, description: 'The student has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
