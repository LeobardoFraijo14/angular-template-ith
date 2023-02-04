import { InjectRepository } from '@nestjs/typeorm';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ERRORS } from '../constants/errors.const';
  
  @ValidatorConstraint({ name: 'email', async: true })
  export class IsEmailNotRegistered implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}
  
    validate(email: any, args: ValidationArguments) {
      return this.userRepository.findOne({ where: { email }}).then(user => {
        if (user) throw new HttpException(ERRORS.Validation_errors.ERR011, HttpStatus.BAD_REQUEST);
        return true;
      });
    }
  }
  
  export function EmailNotRegistered(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsEmailNotRegistered,
      });
    };
  }