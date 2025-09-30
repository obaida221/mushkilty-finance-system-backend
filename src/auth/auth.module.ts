import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthAuthorizationModule } from './auth-authorization.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default-secret-key'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h') 
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthAuthorizationModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, AuthAuthorizationModule],
})
export class AuthModule {}