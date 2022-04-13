import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../database/entities/user.entity';
import { AuthRepository } from '../modules/auth/auth.repository';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'src/database/schemas/user.schema';
import { Model } from "mongoose";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    super({
      secretOrKey: configService.get('AT_SECRET'),
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new UnauthorizedException('You are not alowed to do that!');
    }
    delete user.password;
    return user;
  }
}
