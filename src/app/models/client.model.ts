import { BaseEntity } from './base-entity.model';

export interface Client extends BaseEntity {
  clientId: string;
  clientName: string;
  clientDesc: string;
  tppId: string;
  clientSecret: string;
  status: string;
  logoUri: string;
  uri: string;
  contacts: string[];
} 