import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { EnvironmentSelectionService } from './services/environment-selection.service';
import { AuthService } from './services/auth.service';
import { BoaEnvironment } from './models/boa-environment.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  selectedEnvironment: BoaEnvironment | null = null;
  showNavigation = false;

  constructor(
    private environmentSelectionService: EnvironmentSelectionService,
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNavigation = !event.url.includes('/login') && this.authService.isLoggedIn();
    });
  }

  ngOnInit(): void {
    this.environmentSelectionService.getSelectedEnvironment().subscribe(
      environment => this.selectedEnvironment = environment
    );
    console.log('Application starts');
  }

  changeEnvironment(): void {
    this.environmentSelectionService.clearSelectedEnvironment();
    window.location.href = '/environment-selection';
  }

  logout(): void {
    this.authService.logout();
    this.environmentSelectionService.clearSelectedEnvironment();
    this.router.navigate(['/login']);
  }
}
