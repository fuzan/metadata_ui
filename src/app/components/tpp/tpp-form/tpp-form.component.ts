import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TPP, TPPStatus } from '../../../models/tpp.model';
import { TPPService } from '../../../services/tpp.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SqlModalComponent } from '../sql-modal/sql-modal.component';

@Component({
  selector: 'app-tpp-form',
  templateUrl: './tpp-form.component.html',
  styleUrls: ['./tpp-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule
  ]
})
export class TPPFormComponent implements OnInit {
  tppForm: FormGroup;
  isEditMode = false;
  statusOptions = Object.values(TPPStatus);
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private tppService: TPPService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.tppForm = this.fb.group({
      tppId: ['', Validators.required],
      tppName: ['', Validators.required],
      tppType: ['', Validators.required],
      verifiedClient: ['', Validators.required],
      scopeNameList: ['', Validators.required],
      tppDesc: [''],
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      status: [TPPStatus.ACTIVE, Validators.required],
      createdDate: [new Date()],
      createdBy: [''],
      updatedBy: [''],
      updatedDate: [new Date()]
    });
  }

  ngOnInit(): void {
    const tppId = this.route.snapshot.params['id'];
    if (tppId) {
      this.isEditMode = true;
      this.loadTPP(tppId);
    }
  }

  onSubmit(): void {
    if (this.tppForm.valid) {
      const tpp = this.tppForm.value;
      if (this.isEditMode) {
        this.tppService.updateTPP(tpp)
          .pipe(
            catchError(error => {
              this.showError('Failed to update TPP');
              return of(null);
            })
          )
          .subscribe(result => {
            if (result) {
              this.showSuccess('TPP updated successfully');
              this.router.navigate(['/tpps']);
            }
          });
      } else {
        this.tppService.createTPP(tpp)
          .pipe(
            catchError(error => {
              this.showError('Failed to create TPP');
              return of(null);
            })
          )
          .subscribe(result => {
            if (result) {
              this.showSuccess('TPP created successfully');
              this.router.navigate(['/tpps']);
            }
          });
      }
    }
  }

  generateSQL(): void {
    const formValue = this.tppForm.value;
    const dialogData = {
      tppName: formValue.tppName,
      tppDesc: formValue.tppDesc,
      tppType: formValue.tppType,
      createdDate: new Date()
    };

    this.dialog.open(SqlModalComponent, {
      data: dialogData,
      width: '600px'
    });
  }

  private loadTPP(tppId: string): void {
    this.isLoading = true;
    this.tppService.getTPP(tppId)
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
