import { IsEnum, IsNumber, IsUUID } from "class-validator";
import { ProjectStatus } from "../enums/project-status.enum";

export class CreateFinanceDto {
    @IsUUID()
    projectId:string;

    @IsNumber()
    revenue:number;

    @IsNumber()
    cost:number;

    @IsNumber()
    profit:number;

    @IsEnum(ProjectStatus)
    status:ProjectStatus;

    

}
