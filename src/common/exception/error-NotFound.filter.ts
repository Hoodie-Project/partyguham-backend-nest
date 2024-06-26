import { ExceptionFilter, Catch, ArgumentsHost, HttpException, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const result = exception.getResponse() as { message: any; statusCode: number };
    const message = result.message;
    const statusCode = result.statusCode;

    response.status(statusCode).json({
      message,
      error: 'NOT_FOUND',
      statusCode,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
