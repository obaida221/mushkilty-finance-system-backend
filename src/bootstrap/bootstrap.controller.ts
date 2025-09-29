import { Controller, Post } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('bootstrap')
@Controller('bootstrap')
export class BootstrapController {
  constructor(private service: BootstrapService) {}

  @Post('seed')
  seed() {
    return this.service.run();
  }
}
