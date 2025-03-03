import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Client } from '../models/client.model';
import { environment } from '../../environments/environment';
import { ApiResponse, SUCCESS_STATUS } from '../models/api-response.model';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) { }

  getClients(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<Client>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<Client>>(this.apiUrl, { params }).pipe(
      map(response => ({
        status: response.status,
        content: this.convertResponseToClient(response),
        pagination: response.pagination
      })),
      catchError(() => of())
    );
  }

  getClient(clientId: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${clientId}`);
  }

  createClient(client: Client): Observable<Client> {
    const newClient = {
      ...client,
      createdDate: new Date(),
      updatedDate: new Date(),
      contacts: client.contacts || []
    };
    return this.http.post<Client>(this.apiUrl, newClient);
  }

  updateClient(client: Client): Observable<Client> {
    const updatedClient = {
      ...client,
      updatedDate: new Date()
    };
    return this.http.patch<Client>(`${this.apiUrl}/${client.clientId}`, updatedClient);
  }

  deleteClient(clientId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clientId}`);
  }

  // endpoint is /clientsBatch 
  deleteClients(clientIds: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}Batch`, { body: { "clientIds": clientIds } });
  }

  convertResponseToClient(response: ApiResponse<Client>): Client[] {
    return response?.status === SUCCESS_STATUS && Array.isArray(response.content)
      ? response.content.map(client => ({
          ...client,
          contacts: Array.isArray(client.contacts) ? client.contacts : [],
          intermediaries: Array.isArray(client.intermediaries) ? client.intermediaries : []
        }))
      : [];
  }
} 