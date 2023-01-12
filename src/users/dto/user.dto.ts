export class UserDto {
    
    id: number;
    name: string;
    avatar?: string;
    email: string;
    password: string;
    isSigner: boolean;
    acronym: string;
    active: boolean;
    hashedRT?: string;
    createdAt: Date;
    updatedAt: Date;
}