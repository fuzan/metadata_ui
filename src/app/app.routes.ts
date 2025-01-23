import { Routes } from '@angular/router';
import { environmentGuard } from './guards/environment.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { 
    path: 'environment-selection', 
    loadComponent: () => import('./components/boa-environment/environment-selection/environment-selection.component').then(m => m.EnvironmentSelectionComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'clients', 
    loadComponent: () => import('./components/client/client-list/client-list.component').then(m => m.ClientListComponent),
    canActivate: [authGuard, environmentGuard]
  },
  { 
    path: 'clients/new', 
    loadComponent: () => import('./components/client/client-form/client-form.component').then(m => m.ClientFormComponent),
    canActivate: [authGuard, environmentGuard]
  },
  { 
    path: 'clients/:id/edit', 
    loadComponent: () => import('./components/client/client-form/client-form.component').then(m => m.ClientFormComponent),
    canActivate: [authGuard, environmentGuard]
  },
  { 
    path: 'tpps', 
    loadComponent: () => import('./components/tpp/tpp-list/tpp-list.component').then(m => m.TPPListComponent),
    canActivate: [authGuard, environmentGuard]
  },
  { 
    path: 'tpps/new', 
    loadComponent: () => import('./components/tpp/tpp-form/tpp-form.component').then(m => m.TPPFormComponent),
    canActivate: [authGuard, environmentGuard]
  },
  { 
    path: 'tpps/:id/edit', 
    loadComponent: () => import('./components/tpp/tpp-form/tpp-form.component').then(m => m.TPPFormComponent),
    canActivate: [authGuard, environmentGuard]
  }
]; 