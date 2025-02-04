import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Scope } from '../models/scope.model';
import { map, catchError } from 'rxjs/operators';

const SUCCESS_STATUS = 'success';

interface ApiResponse {
  status: string;
  content: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ScopeService {
  private apiUrl = `${environment.apiUrl}/scopes`;

  constructor(private http: HttpClient) { }

  getScopes(): Observable<Scope[]> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map(response => this.convertResponseToScope(response)),
      catchError(() => of([]))
    );
  }

  getScope(id: string): Observable<Scope | null> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => this.convertResponseToScope(response)[0] || null),
      catchError(() => of(null))
    );
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

  convertResponseToScope(response: ApiResponse): Scope[] {
    return response?.status === SUCCESS_STATUS && Array.isArray(response.content)
      ? response.content.map((item: any) => ({
          scopeName: item?.scopeName ?? '',
          mappingUrl: item?.mappingUrl ?? '',
          scopeDesc: item?.scopeDesc ?? ''
        }))
      : [];
  }
} 