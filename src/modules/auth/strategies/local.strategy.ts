import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
constructor(private authServices:AuthService){
    super({
        usernameField:"email"
    })
}

validate(email:string,password:string){
    
    return this.authServices.validateUser(email,password)
}
}