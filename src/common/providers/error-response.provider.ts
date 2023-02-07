import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class errorResponseProvider{
    constructor(private readonly ConfigService: ConfigService){}

    errorResponse(error: any, req: Request, res : Response): Response{
        const status: number = error.status ? error.status : 500;

        const responseBody = {
            success: false,
            message: error.message,
            status,
            payload: { status, message: error.message, name: error.name },

        }
        return res.status(status).json(responseBody);
    }
}