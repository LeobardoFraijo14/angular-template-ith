import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createErrorResponse } from '../helpers/createErrorResponse.helper';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // response
    //   .json({
    //     statusCode: status,

    //     message: messageList.at(1),
    //     timestamp: new Date().toISOString(),
    //     path: request.url,
    //   });
    //   const errorObject = errorResponseProvider

    return createErrorResponse(exception, status, request, response);
  }
}
