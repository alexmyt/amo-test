import { Controller, Get, Query } from '@nestjs/common';
import { DealMake } from './dto/deal-make.dto';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  /** По ТЗ мы в одном запросе должны:
   * 1. Запросом GET найти и обновить контакт
   * 2. Создать сделку
   *
   * В реальной жизни, скорее всего, этот сценарий нужно делать двумя разными запросами для двух ресурсов: PATCH /clients + POST
   */
  @Get()
  public async getAndUpdateAndMakeDeal(@Query() { name, phone, email }: DealMake) {
    return this.contactsService.getAndUpdateAndMakeDeal({ name, phone, email });
  }
}
