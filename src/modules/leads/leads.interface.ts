export interface EmbeddedContact {
  id: number;
  is_main?: boolean;
}

export interface Lead {
  id?: number;
  name?: string;
  _embedded?: {
    contacts?: EmbeddedContact[];
  };
}

export interface LeadsResponse {
  _embedded: {
    leads: Lead[];
  };
}
