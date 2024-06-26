import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(Error)
export class CustomErrorExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (error instanceof HttpException && error.getStatus() < 500) {
      // HttpException일 경우 처리 로직 추가
      const httpException = error as HttpException;
      const status = httpException.getStatus();
      const result = httpException.getResponse() as { message: any; statusCode: number };

      response.status(status).json({
        ...result,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    } else {
      // 500 이상 에러 상태 코드 사용
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message;

      response.status(status).json({
        message,
        error: 'INTERNAL_SERVER_ERROR',
        statusCode: status,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
