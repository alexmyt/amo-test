import { Module } from '@nestjs/common';

import { AmoCRMModule } from '../amocrm/amocrm.module';

import { LeadsService } from './leads.service';

@Module({
  imports: [AmoCRMModule],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
