import { Injectable } from '@angular/core';

interface Credentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  
  private readonly validCredentials: Credentials[] = [
    { username: 'admin', password: 'admin' },
    { username: 'client', password: 'client' },
    { username: 'guest', password: 'guestwho' }
  ];

  constructor() {
    // Check if there's a stored authentication state
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  }

  login(username: string, password: string): boolean {
    const isValid = this.validCredentials.some(
      cred => cred.username === username && cred.password === password
    );

    if (isValid) {
      this.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', username);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('currentUser');
  }
} 