import { HttpException } from "@nestjs/common";
import { Request, Response } from "express";

function createErrorResponse(exception: HttpException, status: number, req: Request, res : Response){
    const message = exception.getResponse();
    const messageList = Object.values(message);
    
    const responseBody: any = {
        success: false,
        message: messageList.at(1),
        status: exception.getStatus(),
        payload: { status, message: exception.message },
    };

    return res.status(status).json(responseBody)
}

export { createErrorResponse };