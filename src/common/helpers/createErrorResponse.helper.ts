import { HttpException } from "@nestjs/common";
import { Request, Response } from "express";

function createErrorResponse(exception: HttpException, status: number, req: Request, res : Response){
    const message: any = exception.getResponse();
    
    // let messageList = message;
    // if(typeof messageList == 'object'){
    //     const arrayValues = Object.values(message);
    //     messageList = arrayValues.at(1); 
    // }
    let msg = typeof message == 'string' && message || message.message || 'Error al procesar la peticion'
    
    const responseBody: any = {
        success: false,
        message: msg,
        status: exception.getStatus(),
        payload: { status, message: exception.message },
    };

    return res.status(status).json(responseBody)
}

export { createErrorResponse };