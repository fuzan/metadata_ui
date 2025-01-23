import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Org } from '../models/org.model';

@Injectable({
  providedIn: 'root'
})
export class OrgService {
  private apiUrl = `${environment.apiUrl}/orgs`;

  constructor(private http: HttpClient) { }

  getOrgs(): Observable<Org[]> {
    return this.http.get<Org[]>(this.apiUrl);
  }

  getOrg(orgId: string): Observable<Org> {
    return this.http.get<Org>(`${this.apiUrl}/${orgId}`);
  }

  createOrg(org: Org): Observable<Org> {
    const newOrg = {
      ...org,
      createdDate: new Date(),
      updatedDate: new Date()
    };
    return this.http.post<Org>(this.apiUrl, newOrg);
  }

  updateOrg(org: Org): Observable<Org> {
    const updatedOrg = {
      ...org,
      updatedDate: new Date()
    };
    return this.http.put<Org>(`${this.apiUrl}/${org.orgId}`, updatedOrg);
  }

  deleteOrg(orgId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orgId}`);
  }

  deleteOrgs(orgIds: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/batch`, { body: { "orgIds": orgIds } });
  }
} 