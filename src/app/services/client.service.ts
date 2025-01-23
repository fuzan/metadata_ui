import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
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
    return this.http.put<Client>(`${this.apiUrl}/${client.clientId}`, updatedClient);
  }

  deleteClient(clientId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clientId}`);
  }

  deleteClients(clientIds: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/batch`, { body: { "clientIds" :clientIds} });
  }
} 