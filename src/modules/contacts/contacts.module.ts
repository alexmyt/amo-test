import { Module } from '@nestjs/common';

import { AmoCRMModule } from '../amocrm/amocrm.module';

import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { LeadsModule } from '../leads/leads.module';

@Module({
  imports: [AmoCRMModule, LeadsModule],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
