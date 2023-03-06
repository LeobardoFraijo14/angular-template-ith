import { Exclude } from "class-transformer";

export class ProfileDto {
    id: number;
    name: string;
    firstName: string;
    secondName: string;
    @Exclude({ toPlainOnly: true })
    avatar: string;
    @Exclude({ toPlainOnly: true })
    organismId: number;
    @Exclude({ toPlainOnly: true })
    organismTypeId: number;
    @Exclude({ toPlainOnly: true })
    suborganismId: number;
    @Exclude({ toPlainOnly: true })
    job: string;
    @Exclude({ toPlainOnly: true })
    email: string;
    @Exclude({ toPlainOnly: true })
    createdBy: number;
    @Exclude({ toPlainOnly: true })
    isActive: boolean;
    @Exclude({ toPlainOnly: true })
    password: string;
    @Exclude({ toPlainOnly: true })
    hashedRT: string;
    @Exclude({ toPlainOnly: true })
    order: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

  constructor(partial: Partial<ProfileDto>) {
    Object.assign(this, partial);
  }
}
