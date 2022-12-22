export class UserDto {
    
    id: number;
    name: string;
    avatar?: string;
    email: string;
    isSigner: boolean;
    acronym: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}