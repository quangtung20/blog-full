import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInCredentialsDto } from './dto/sign-in-credential.dto';

@Controller('')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    register(
        @Body() body: AuthCredentialsDto
    ) {
        return this.authService.register(body)
    }

    @Post('/active')
    active(
        @Body('active_token') active_token: string
    ) {
        return this.authService.active(active_token)
    }

    @Post('/login')
    login(
        @Body('account') account: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.login(account, password, res);
    }

    @Get('/logout')
    logout(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }

    @Get('/refresh_token')
    refreshToken(
        @Req() req: Request
    ) {
        return this.authService.refreshToken(req);
    }

    @Post('/google_login')
    googleLogin(
        @Body('id_token') id_token: string,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.googleLogin(id_token, res)
    }

}
