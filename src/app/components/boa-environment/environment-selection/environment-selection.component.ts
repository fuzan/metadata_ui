import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BoaEnvironment } from '../../../models/boa-environment.model';
import { EnvironmentSelectionService } from '../../../services/environment-selection.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-environment-selection',
  templateUrl: './environment-selection.component.html',
  styleUrls: ['./environment-selection.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ]
})
export class EnvironmentSelectionComponent implements OnInit {
  environments: BoaEnvironment[] = [];
  isLoading = false;

  constructor(
    private environmentSelectionService: EnvironmentSelectionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadEnvironments();
  }

  loadEnvironments(): void {
    this.isLoading = true;
    this.environmentSelectionService.getEnvironments()
      .pipe(
        catchError(error => {
          this.showError('Failed to load environments');
          return of([]);
        })
      )
      .subscribe((environments) => {
        this.isLoading = false;
        this.environments = environments;
      });
  }

  onEnvironmentChange(environment: BoaEnvironment): void {
    this.environmentSelectionService.setSelectedEnvironment(environment);
    this.router.navigate(['/clients']);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
} 