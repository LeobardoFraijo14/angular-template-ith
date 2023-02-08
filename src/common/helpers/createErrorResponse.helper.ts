import { HttpException } from "@nestjs/common";
import { Request, Response } from "express";

function createErrorResponse(exception: HttpException, status: number, req: Request, res : Response){
    const message = exception.getResponse();
    
    let messageList = message;
    if(typeof messageList == 'object'){
        const arrayValues = Object.values(message);
        messageList = arrayValues.at(1); 
    }
    
    const responseBody: any = {
        success: false,
        message: messageList,
        status: exception.getStatus(),
        payload: { status, message: exception.message },
    };

    return res.status(status).json(responseBody)
}

export { createErrorResponse };