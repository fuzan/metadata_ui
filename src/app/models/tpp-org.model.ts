import { BaseEntity } from './base-entity.model';
import { TPP } from './tpp.model';
import { Org } from './org.model';

export interface TppOrg extends BaseEntity {
    tppOrgId: string;
    tpp: TPP;
    org: Org;
    status: string;
}

export enum TppOrgStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
} 