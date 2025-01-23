import { BaseEntity } from './base-entity.model';

export interface Scope extends BaseEntity {
    scopeName: string;
    mappingUrlList: string;
    scopeDesc: string;
} 