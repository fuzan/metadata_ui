import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Scope } from '../models/scope.model';

@Injectable({
  providedIn: 'root'
})
export class ScopeService {
  private apiUrl = `${environment.apiUrl}/scopes`;

  constructor(private http: HttpClient) { }

  getScopes(): Observable<Scope[]> {
    return this.http.get<Scope[]>(this.apiUrl);
  }

  getScope(id: string): Observable<Scope> {
    return this.http.get<Scope>(`${this.apiUrl}/${id}`);
  }

  createScope(scope: Scope): Observable<Scope> {
    const newScope = {
      ...scope,
      createdDate: new Date(),
      updatedDate: new Date()
    };
    return this.http.post<Scope>(this.apiUrl, newScope);
  }

  updateScope(scope: Scope): Observable<Scope> {
    const updatedScope = {
      ...scope,
      updatedDate: new Date()
    };
    return this.http.put<Scope>(`${this.apiUrl}/${scope.scopeName}`, updatedScope);
  }

  deleteScope(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteScopes(ids: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/batch`, { body: ids });
  }
} 