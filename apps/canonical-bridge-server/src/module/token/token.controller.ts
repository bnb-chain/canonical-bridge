import { Controller, Get, Logger } from '@nestjs/common';
import { TokenService } from '@/module/token/token.service';

@Controller('token')
export class TokenController {
  private logger = new Logger(TokenController.name);

  constructor(private tokenService: TokenService) {}

  @Get()
  getTokens() {
    return this.tokenService.getTokens();
  }
}
