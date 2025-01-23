import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TPP } from '../../../models/tpp.model';
import { TPPService } from '../../../services/tpp.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-tpp-form',
  templateUrl: './tpp-form.component.html',
  styleUrls: ['./tpp-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class TPPFormComponent implements OnInit {
  tppForm: FormGroup;
  isEditMode = false;
  tppId?: string;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private tppService: TPPService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.tppForm = this.fb.group({
      name: ['', Validators.required],
      tppDesc: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.tppId = id;
      this.loadTPP(this.tppId);
    }
  }

  loadTPP(id: string): void {
    this.isLoading = true;
    this.tppService.getTPP(id)
      .pipe(
        catchError(error => {
          this.showError('Failed to load TPP');
          this.router.navigate(['/tpps']);
          return of(null);
        })
      )
      .subscribe(tpp => {
        this.isLoading = false;
        if (tpp) {
          this.tppForm.patchValue(tpp);
        }
      });
  }

  onSubmit(): void {
    if (this.tppForm.valid) {
      this.isLoading = true;
      const tppData: TPP = {
        ...this.tppForm.value,
        id: this.tppId || 0
      };

      const operation = this.isEditMode
        ? this.tppService.updateTPP(tppData)
        : this.tppService.createTPP(tppData);

      operation
        .pipe(
          catchError(error => {
            this.showError(`Failed to ${this.isEditMode ? 'update' : 'create'} TPP`);
            return of(null);
          })
        )
        .subscribe(result => {
          this.isLoading = false;
          if (result) {
            this.showSuccess(`TPP ${this.isEditMode ? 'updated' : 'created'} successfully`);
            this.router.navigate(['/tpps']);
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
