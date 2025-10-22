import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object' && responseBody !== null) {
        message = (responseBody as any).message || message;
      }
    }

    // Enhanced logging for debugging
    const errorDetails = {
      timestamp: new Date().toISOString(),
      method: request.method,
      path: request.url,
      status,
      message,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
      body: request.body,
      params: request.params,
      query: request.query,
    };

    // Log error details to console for immediate debugging
    console.error('\n=== ERROR CAUGHT BY EXCEPTION FILTER ===');
    console.error('Error Details:', JSON.stringify(errorDetails, null, 2));

    if (exception instanceof Error) {
      console.error('Exception Stack:', exception.stack);
      console.error('Exception Message:', exception.message);
    } else {
      console.error('Raw Exception:', exception);
    }
    console.error('============================================\n');

    // Also use NestJS logger for production logging
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
