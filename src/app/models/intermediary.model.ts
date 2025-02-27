import { BaseEntity } from './base-entity.model';

export interface Intermediary extends BaseEntity {
    name: string;
    description: string;
    uri: string;
    logoUri: string;
    contacts: string[];
}
