import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { BoaEnvironment } from '../models/boa-environment.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentSelectionService {

    private selectedEnvironment = new BehaviorSubject<BoaEnvironment | null>(null);

    private apiUrl = `${environment.apiUrl}/environment`;

    constructor(private http: HttpClient) { }

    getEnvironments(): Observable<BoaEnvironment[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(response => this.convertResponseToBoaEnvironments(response))
        );
    }

    setSelectedEnvironment(environment: BoaEnvironment): void {
        this.selectedEnvironment.next(environment);
        // Optionally store in localStorage for persistence
        localStorage.setItem('selectedEnvironment', JSON.stringify(environment));
    }

    hasEnvironmentSelected(): boolean {
        return this.selectedEnvironment.value !== null;
    }

    getSelectedEnvironment(): Observable<BoaEnvironment | null> {
        return this.selectedEnvironment.asObservable();
    }

    clearSelectedEnvironment(): void {
        this.selectedEnvironment.next(null);
        localStorage.removeItem('selectedEnvironment');
    }

    convertResponseToBoaEnvironments(response: any): BoaEnvironment[] {
        if (response.status === 'success' && Array.isArray(response.content)) {
            const random: number = Math.floor(Math.random() * 101);
            return response.content.map((envName: string) => ({ name: envName, id: random } as BoaEnvironment));
        }
        return [];
    }
} 