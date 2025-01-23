import { BaseEntity } from './base-entity.model';

export interface Scope extends BaseEntity {
    scopeName: string;
    mappingUrl: string;
} 