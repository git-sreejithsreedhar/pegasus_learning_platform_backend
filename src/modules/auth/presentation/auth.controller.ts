import {
  Controller,
  Post,
  HttpCode,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken: string | null =
      (req.cookies?.refreshToken as string | undefined) ?? null;

    if (refreshToken) {
      await this.logoutUseCase(refreshToken);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async logoutUseCase(refreshToken: string): Promise<void> {
    await Promise.resolve();

    throw new Error('Method not implemented.');
  }
}
