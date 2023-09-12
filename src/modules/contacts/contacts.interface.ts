export interface Contact {
  id?: number;
  name: string;
  email: string;
  phone: string;
}

export interface ContactsResponse {
  _embedded: {
    contacts: Contact[];
  };
}
