import { Routes } from '@angular/router';
import { environmentGuard } from './guards/environment.guard';
import { authGuard } from './guards/auth.guard';
import { ScopeListComponent } from './components/scope/scope-list/scope-list.component';
import { ScopeFormComponent } from './components/scope/scope-form/scope-form.component';

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
  },
  {
    path: 'scopes',
    component: ScopeListComponent,
    canActivate: [authGuard, environmentGuard]
  },
  {
    path: 'scopes/new',
    component: ScopeFormComponent,
    canActivate: [authGuard, environmentGuard]
  },
  {
    path: 'scopes/:id/edit',
    component: ScopeFormComponent,
    canActivate: [authGuard, environmentGuard]
  },
  { 
    path: 'tpp-orgs', 
    loadComponent: () => import('./components/tpp-org/tpp-org-list/tpp-org-list.component').then(m => m.TppOrgListComponent),
    canActivate: [authGuard, environmentGuard]
  },
  { 
    path: 'tpp-orgs/new', 
    loadComponent: () => import('./components/tpp-org/tpp-org-form/tpp-org-form.component').then(m => m.TppOrgFormComponent),
    canActivate: [authGuard, environmentGuard]
  },
  { 
    path: 'tpp-orgs/:id/edit', 
    loadComponent: () => import('./components/tpp-org/tpp-org-form/tpp-org-form.component').then(m => m.TppOrgFormComponent),
    canActivate: [authGuard, environmentGuard]
  },
  { 
    path: 'orgs', 
    loadComponent: () => import('./components/org/org-list/org-list.component').then(m => m.OrgListComponent),
    canActivate: [authGuard, environmentGuard]
  },
  { 
    path: 'orgs/new', 
    loadComponent: () => import('./components/org/org-form/org-form.component').then(m => m.OrgFormComponent),
    canActivate: [authGuard, environmentGuard]
  },
  { 
    path: 'orgs/:id/edit', 
    loadComponent: () => import('./components/org/org-form/org-form.component').then(m => m.OrgFormComponent),
    canActivate: [authGuard, environmentGuard]
  }
]; 