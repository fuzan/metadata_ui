import { BaseEntity } from './base-entity.model';

export enum TPPStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export interface TPP extends BaseEntity {
    tppId: string;
    tppName: string;
    tppType: string;
    verifiedClient: string;
    scopeNameList: string;
    tppDesc: string;
    contactName: string;
    contactEmail: string;
    status: TPPStatus;
} 