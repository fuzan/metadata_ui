import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TppOrg } from '../models/tpp-org.model';

@Injectable({
  providedIn: 'root'
})
export class TppOrgService {
  private apiUrl = `${environment.apiUrl}/tpp_orgs`;

  constructor(private http: HttpClient) { }

  getTppOrgs(): Observable<TppOrg[]> {
    return this.http.get<TppOrg[]>(this.apiUrl);
  }

  getTppOrg(tppOrgId: string): Observable<TppOrg> {
    return this.http.get<TppOrg>(`${this.apiUrl}/${tppOrgId}`);
  }

  createTppOrg(tppOrg: TppOrg): Observable<TppOrg> {
    const newTppOrg = {
      ...tppOrg,
      createdDate: new Date(),
      updatedDate: new Date()
    };
    return this.http.post<TppOrg>(this.apiUrl, newTppOrg);
  }

  updateTppOrg(tppOrg: TppOrg): Observable<TppOrg> {
    const updatedTppOrg = {
      ...tppOrg,
      updatedDate: new Date()
    };
    return this.http.put<TppOrg>(`${this.apiUrl}/${tppOrg.tppOrgId}`, updatedTppOrg);
  }

  deleteTppOrg(tppOrgId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tppOrgId}`);
  }

  deleteTppOrgs(tppOrgIds: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/batch`, { body: { "tppOrgIds": tppOrgIds } });
  }
} 