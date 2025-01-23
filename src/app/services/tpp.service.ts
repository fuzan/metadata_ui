import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TPP } from '../models/tpp.model';

@Injectable({
  providedIn: 'root'
})
export class TPPService {
  private apiUrl = `${environment.apiUrl}/tpps`;

  constructor(private http: HttpClient) { }

  getTPPs(): Observable<TPP[]> {
    return this.http.get<TPP[]>(this.apiUrl);
  }

  getTPP(tppId: string): Observable<TPP> {
    return this.http.get<TPP>(`${this.apiUrl}/${tppId}`);
  }

  createTPP(tpp: TPP): Observable<TPP> {
    const newTPP = {
      ...tpp,
      createdDate: new Date(),
      updatedDate: new Date()
    };
    return this.http.post<TPP>(this.apiUrl, newTPP);
  }

  updateTPP(tpp: TPP): Observable<TPP> {
    const updatedTPP = {
      ...tpp,
      updatedDate: new Date()
    };
    return this.http.put<TPP>(`${this.apiUrl}/${tpp.tppId}`, updatedTPP);
  }

  deleteTPP(tppId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tppId}`);
  }
} 