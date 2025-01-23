import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Scope } from '../../../models/scope.model';
import { ScopeService } from '../../../services/scope.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-scope-form',
  templateUrl: './scope-form.component.html',
  styleUrls: ['./scope-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class ScopeFormComponent implements OnInit {
  scopeForm: FormGroup;
  isEditMode = false;
  scopeId?: string;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private scopeService: ScopeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.scopeForm = this.fb.group({
      scopeName: ['', Validators.required],
      mappingUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.scopeId = id;
      this.loadScope(id);
    }
  }

  loadScope(id: string): void {
    this.isLoading = true;
    this.scopeService.getScope(id)
      .pipe(
        catchError(error => {
          this.showError('Failed to load scope');
          this.router.navigate(['/scopes']);
          return of(null);
        })
      )
      .subscribe(scope => {
        this.isLoading = false;
        if (scope) {
          this.scopeForm.patchValue(scope);
        }
      });
  }

  onSubmit(): void {
    if (this.scopeForm.valid) {
      this.isLoading = true;
      const scopeData: Scope = {
        ...this.scopeForm.value,
        id: this.scopeId
      };

      const operation = this.isEditMode
        ? this.scopeService.updateScope(scopeData)
        : this.scopeService.createScope(scopeData);

      operation
        .pipe(
          catchError(error => {
            this.showError(`Failed to ${this.isEditMode ? 'update' : 'create'} scope`);
            return of(null);
          })
        )
        .subscribe(result => {
          this.isLoading = false;
          if (result) {
            this.showSuccess(`Scope ${this.isEditMode ? 'updated' : 'created'} successfully`);
            this.router.navigate(['/scopes']);
          }
        });
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
} 