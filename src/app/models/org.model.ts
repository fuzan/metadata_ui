import { BaseEntity } from './base-entity.model';

export interface Org extends BaseEntity {
    orgId: string;
    orgName: string;
    orgDesc: string;
    status: OrgStatus;
    customerIdTypeCode: string;
}

export enum OrgStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
} 