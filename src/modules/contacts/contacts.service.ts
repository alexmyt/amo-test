import { Injectable } from '@nestjs/common';
import { AmoCRMService } from '../amocrm/amocrm.service';
import { Contact, ContactsResponse } from './contacts.interface';
import { LeadsService } from '../leads/leads.service';

@Injectable()
export class ContactsService {
  constructor(
    private readonly amocrmService: AmoCRMService,
    private readonly dealsService: LeadsService,
  ) {}

  /** Main flow from Technical Specs */
  public async getAndUpdateAndMakeDeal(payload: Contact) {
    let contact = await this.getOneByFilter(payload);

    if (contact) {
      await this.updateOne(contact.id, payload);
    } else {
      contact = await this.addOne(payload);
    }

    return await this.dealsService.addOne({}, [{ id: contact.id, is_main: true }]);
  }

  /** Add one contact */
  public async addOne(contact: Contact): Promise<Contact> {
    const custom_fields_values = this.customFields(contact);

    const result = await this.amocrmService.request<ContactsResponse>({
      method: 'POST',
      url: '/api/v4/contacts',
      data: [{ name: contact.name, custom_fields_values }],
    });

    return result._embedded.contacts[0];
  }

  /** Update one contact */
  public async updateOne(contactId: number, contact: Contact): Promise<Contact> {
    const custom_fields_values = this.customFields(contact);

    const result = await this.amocrmService.request<Contact>({
      method: 'PATCH',
      url: `/api/v4/contacts/${contactId}`,
      data: [{ name: contact.name, custom_fields_values }],
    });

    return result;
  }

  /** Get one contact by filters */
  public async getOneByFilter({ phone, email }: Contact): Promise<Contact | null> {
    const result = await this.amocrmService.request<ContactsResponse>({
      method: 'GET',
      url: '/api/v4/contacts',
      params: { filter: { phone, email } },
    });

    return result._embedded.contacts[0];
  }

  /** Prepare custom fields for contact */
  private customFields({ phone, email }: Contact) {
    return [
      {
        field_code: 'PHONE',
        values: [
          {
            value: phone,
            enum_code: 'OTHER',
          },
        ],
      },
      {
        field_code: 'EMAIL',
        values: [
          {
            value: email,
            enum_code: 'OTHER',
          },
        ],
      },
    ];
  }
}
