import { HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { LOG_MOVEMENTS } from "../enums/log-movements.enum";

//Enums
import { SYSTEM_CATALOGUES } from "../enums/system-catalogues.enum";

//Dtos
import { CreateLogDto } from '../../system-logs/dto/create-log.dto';

function createLogObject(catalogue: SYSTEM_CATALOGUES, movement: LOG_MOVEMENTS, newInfo: any, oldInfo?: any){
    const newLogDto = new(CreateLogDto);
    const newInfoString = JSON.stringify(newInfo);
    if(oldInfo){
        oldInfo = JSON.stringify(oldInfo);
    }
    newLogDto.catalogue = catalogue;
    newLogDto.movement = movement;
    newLogDto.newInfo = newInfoString;
    if(oldInfo){
        newLogDto.oldInfo = oldInfo;
    }

    return newLogDto;

}

export { createLogObject };