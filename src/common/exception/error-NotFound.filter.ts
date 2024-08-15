import { ExceptionFilter, Catch, ArgumentsHost, HttpException, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(exception);

    const result = exception.getResponse() as { message: any; error: any; statusCode: number };
    const message = result.message;
    const statusCode = result.statusCode;
    const error = result.error;

    response.status(statusCode).json({
      message,
      error: error || 'NOT_FOUND',
      statusCode,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
