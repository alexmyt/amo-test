import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AmoCRMController } from './amocrm.controller';
import { AmoCRMService } from './amocrm.service';

@Module({
  imports: [HttpModule],
  controllers: [AmoCRMController],
  providers: [AmoCRMService],
  exports: [AmoCRMService],
})
export class AmoCRMModule {}
