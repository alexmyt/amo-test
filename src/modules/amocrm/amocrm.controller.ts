import { Controller, Get, Query } from '@nestjs/common';
import { AmoCRMService } from './amocrm.service';
import { RedirectRequestQuery } from './amocrm.interface';

@Controller('auth')
export class AmoCRMController {
  constructor(private readonly authService: AmoCRMService) {}

  @Get('redirect')
  public async redirect(@Query() { client_id, code }: RedirectRequestQuery) {
    return this.authService.accessTokenByCode(client_id, code);
  }
}
