import { BaseEntity } from './base-entity.model';
import { Client } from './client.model';
import { Org } from './org.model';

export enum ClientOrgStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export interface ClientOrg extends BaseEntity {
    clientOrgId: string;
    client: Client;
    org: Org;
    status: ClientOrgStatus;
} 