import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Scope } from '../models/scope.model';
import { ApiResponse, SUCCESS_STATUS } from '../models/api-response.model';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScopeService {
  private apiUrl = `${environment.apiUrl}/scopes`;

  constructor(private http: HttpClient) { }

  getScopes(): Observable<Scope[]> {
    return this.http.get<ApiResponse<Scope>>(this.apiUrl).pipe(
      map(response => this.convertResponseToScope(response)),
      catchError(() => of([]))
    );
  }

  getScope(id: string): Observable<Scope> {
    return this.http.get<Scope>(`${this.apiUrl}/${id}`);
  }

  createScope(scope: Scope): Observable<Scope> {
    return this.http.post<Scope>(this.apiUrl, scope);
  }

  updateScope(scope: Scope): Observable<Scope> {
    return this.http.patch<Scope>(`${this.apiUrl}/${scope.scopeName}`, scope);
  }

  deleteScope(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteScopes(ids: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/batch`, { body: ids });
  }

  convertResponseToScope(response: ApiResponse<Scope>): Scope[] {
    return response?.status === SUCCESS_STATUS && Array.isArray(response.content)
      ? response.content.map(scope => ({
          ...scope
        }))
      : [];
  }
} 