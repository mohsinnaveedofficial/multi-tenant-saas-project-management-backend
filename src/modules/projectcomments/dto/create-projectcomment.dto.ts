import { IsString, IsUUID } from "class-validator";

export class CreateProjectcommentDto {
    @IsString()
    comment:string;

    @IsUUID()
    @IsString()
    projectId:string;

    
}
