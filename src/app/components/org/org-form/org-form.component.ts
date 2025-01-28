import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Org, OrgStatus } from '../../../models/org.model';
import { OrgService } from '../../../services/org.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-org-form',
  templateUrl: './org-form.component.html',
  styleUrls: ['./org-form.component.css'],
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
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class OrgFormComponent implements OnInit {
  orgForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  statusOptions = Object.values(OrgStatus);

  constructor(
    private fb: FormBuilder,
    private orgService: OrgService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.orgForm = this.fb.group({
      orgId: [null],
      orgName: ['', Validators.required],
      orgDesc: [''],
      status: ['active', Validators.required],
      customerIdTypeCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const orgId = this.route.snapshot.paramMap.get('id');
    if (orgId) {
      this.isEditMode = true;
      this.loadOrg(orgId);
    }
  }

  loadOrg(orgId: string): void {
    this.isLoading = true;
    this.orgService.getOrg(orgId)
      .pipe(
        catchError(error => {
          this.showError('Failed to load organization');
          this.router.navigate(['/orgs']);
          return of(null);
        })
      )
      .subscribe(org => {
        if (org) {
          this.orgForm.patchValue(org);
        }
        this.isLoading = false;
      });
  }

  onSubmit(): void {
    if (this.orgForm.invalid) {
      this.showError('Organization ID is required');
      return;
    }

    if (!this.isEditMode && !this.orgForm.value.orgId) {
      // Generate a random orgId if it's empty or null during creation
      this.orgForm.patchValue({
        orgId: `org-${Math.random().toString(36).substr(2, 9)}`
      });
    }

    if (this.orgForm.valid) {
      this.isLoading = true;
      const orgData = this.orgForm.value;

      const operation = this.isEditMode
        ? this.orgService.updateOrg(orgData)
        : this.orgService.createOrg(orgData);

      operation
        .pipe(
          catchError(error => {
            this.showError(`Failed to ${this.isEditMode ? 'update' : 'create'} organization`);
            return of(null);
          })
        )
        .subscribe(result => {
          this.isLoading = false;
          if (result) {
            this.showSuccess(`Organization ${this.isEditMode ? 'updated' : 'created'} successfully`);
            this.router.navigate(['/orgs']);
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