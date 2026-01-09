import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateTenantDto } from '../tenant/dto/create-tenant.dto';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import { DataSource } from 'typeorm';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import * as argon2 from "argon2"
import { CurrentUser } from './types/current-user';

@Injectable()
export class AuthService {
  constructor(
    private readonly tenantServices: TenantService,
    private readonly userServices: UserService,
    private readonly dataSource: DataSource,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {}
  async signup(createUserDto: CreateUserDto, createTenantDto: CreateTenantDto) {
    return this.dataSource.transaction(async (manager) => {
      try {
        const tenant = await this.tenantServices.create(
          createTenantDto,
          manager,
        );
        const user = await this.userServices.create(
          createUserDto,
          tenant.id,
          manager,
        );
        return user;
      } catch (error) {
        if (error.code === '23505') {
          throw new ConflictException('Email already exists');
        }
        throw error;
      }
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userServices.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found!');
    }
    const isPasswordMatch = await compare(password, user.passwordHash);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');

    return { id: user.id };
  }

  async login(userId: string) {
   
    const {accessToken,refreshToken}=await this.generateToken(userId);
    const hashedRefreshToken=await argon2.hash(refreshToken);
      await this.userServices.updateHashedRefreshToken(userId,hashedRefreshToken);
    return { id: userId, accessToken, refreshToken };
  }

  async generateToken(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfiguration),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: string) {
    const {accessToken,refreshToken}=await this.generateToken(userId);
    const hashedRefreshToken=await argon2.hash(refreshToken);
      await this.userServices.updateHashedRefreshToken(userId,hashedRefreshToken);
    return { id: userId, accessToken, refreshToken };

  }

  async validateRefreshToken(userId:string,refreshToken:string){
    const user=await this.userServices.findOne(userId)
    if(!user || !user.hashedRefreshToken){
      throw new UnauthorizedException("Invalid Refresh Token");
    }
    const refreshTokenMatches=await argon2.verify(user.hashedRefreshToken,refreshToken);

    if(!refreshTokenMatches){
      throw new UnauthorizedException("Invalid Refresh Token");
    }
    return {id:user.id} 
  }


  async signOut(userId:string){
    await this.userServices.updateHashedRefreshToken(userId,null)
  }

  async validateJwtUser(userId:string){
    const user=await this.userServices.findOne(userId)
    if(!user) throw new UnauthorizedException("User not found!");
    const currentUser:CurrentUser={id:user.id,role:user.role}
    return currentUser;
  }
}
