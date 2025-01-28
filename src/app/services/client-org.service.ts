import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClientOrg } from '../models/client-org.model';

@Injectable({
  providedIn: 'root'
})
export class ClientOrgService {
  private apiUrl = `${environment.apiUrl}/client_orgs`;

  constructor(private http: HttpClient) { }

  getClientOrgs(): Observable<ClientOrg[]> {
    return this.http.get<ClientOrg[]>(this.apiUrl);
  }

  getClientOrg(clientOrgId: string): Observable<ClientOrg> {
    return this.http.get<ClientOrg>(`${this.apiUrl}/${clientOrgId}`);
  }

  createClientOrg(clientOrg: ClientOrg): Observable<ClientOrg> {
    if (!clientOrg.clientOrgId) {
      return throwError(() => new Error('Client Organization ID is required'));
    }

    const newClientOrg = {
      ...clientOrg,
      createdDate: new Date(),
      updatedDate: new Date()
    };
    return this.http.post<ClientOrg>(this.apiUrl, newClientOrg);
  }

  updateClientOrg(clientOrg: ClientOrg): Observable<ClientOrg> {
    const updatedClientOrg = {
      ...clientOrg,
      updatedDate: new Date()
    };
    return this.http.patch<ClientOrg>(`${this.apiUrl}/${clientOrg.clientOrgId}`, updatedClientOrg);
  }

  deleteClientOrg(clientOrgId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clientOrgId}`);
  }

  deleteClientOrgs(clientOrgIds: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}Batch`, { body: { "clientOrgIds": clientOrgIds } });
  }
} 