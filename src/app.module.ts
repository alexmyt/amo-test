import { Module } from '@nestjs/common';
import { AmoCRMModule } from './modules/amocrm/amocrm.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { LeadsModule } from './modules/leads/leads.module';

@Module({
  imports: [AmoCRMModule, ContactsModule, LeadsModule],
})
export class AppModule {}
