import { Injectable } from '@nestjs/common';

import { AmoCRMService } from '../amocrm/amocrm.service';
import { Lead, LeadsResponse, EmbeddedContact } from './leads.interface';

@Injectable()
export class LeadsService {
  constructor(private readonly amocrmService: AmoCRMService) {}

  /** Add one lead with contacts */
  public async addOne(lead: Lead, contacts: EmbeddedContact[]) {
    const result = await this.amocrmService.request<LeadsResponse>({
      method: 'POST',
      url: '/api/v4/leads',
      data: [{ ...lead, _embedded: { contacts } }],
    });

    return result._embedded.leads[0];
  }
}
