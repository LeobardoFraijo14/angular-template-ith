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
  
  @ValidatorConstraint({ name: 'email', async: true })
  export class IsEmailNotRegistered implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}
  
    async validate(email: any, args: ValidationArguments) {
      return await this.userRepository.findOne({ where: { email }}).then(user => {
        if (user) {
          return false;
        };
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