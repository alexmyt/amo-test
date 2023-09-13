import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AmoCRMModule } from './modules/amocrm/amocrm.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { LeadsModule } from './modules/leads/leads.module';

@Module({
  imports: [AmoCRMModule, ContactsModule, LeadsModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
