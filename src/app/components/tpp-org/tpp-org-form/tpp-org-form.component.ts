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
import { TppOrgStatus } from '../../../models/tpp-org.model';
import { TPP } from '../../../models/tpp.model';
import { Org } from '../../../models/org.model';
import { TppOrgService } from '../../../services/tpp-org.service';
import { TPPService } from '../../../services/tpp.service';
import { OrgService } from '../../../services/org.service';
import { catchError, forkJoin } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-tpp-org-form',
  templateUrl: './tpp-org-form.component.html',
  styleUrls: ['./tpp-org-form.component.css'],
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
    MatProgressSpinnerModule
  ]
})
export class TppOrgFormComponent implements OnInit {
  tppOrgForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  tpps: TPP[] = [];
  orgs: Org[] = [];
  statusOptions = Object.values(TppOrgStatus);

  constructor(
    private fb: FormBuilder,
    private tppOrgService: TppOrgService,
    private tppService: TPPService,
    private orgService: OrgService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.tppOrgForm = this.fb.group({
      tppOrgId: [''],
      tpp: [null, Validators.required],
      org: [null, Validators.required],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSelectOptions();

    const tppOrgId = this.route.snapshot.paramMap.get('id');
    if (tppOrgId) {
      this.isEditMode = true;
      this.loadTppOrg(tppOrgId);
    }
  }

  loadSelectOptions(): void {
    this.isLoading = true;
    forkJoin({
      tpps: this.tppService.getTPPs(),
      orgs: this.orgService.getOrgs()
    }).pipe(
      catchError(error => {
        this.showError('Failed to load form options');
        return of({ tpps: [], orgs: [] });
      })
    ).subscribe(result => {
      this.tpps = result.tpps;
      this.orgs = result.orgs;
      this.isLoading = false;
    });
  }

  loadTppOrg(tppOrgId: string): void {
    this.isLoading = true;
    this.tppOrgService.getTppOrg(tppOrgId)
      .pipe(
        catchError(error => {
          this.showError('Failed to load TPP organization');
          this.router.navigate(['/tpp-orgs']);
          return of(null);
        })
      )
      .subscribe(tppOrg => {
        if (tppOrg) {
          this.tppOrgForm.patchValue({
            tppOrgId: tppOrg.tppOrgId,
            tpp: tppOrg.tpp,
            org: tppOrg.org,
            status: tppOrg.status
          });
        }
        this.isLoading = false;
      });
  }

  onSubmit(): void {
    if (this.tppOrgForm.valid) {
      this.isLoading = true;
      const tppOrgData = this.tppOrgForm.value;

      const operation = this.isEditMode
        ? this.tppOrgService.updateTppOrg(tppOrgData)
        : this.tppOrgService.createTppOrg(tppOrgData);

      operation
        .pipe(
          catchError(error => {
            this.showError(`Failed to ${this.isEditMode ? 'update' : 'create'} TPP organization`);
            return of(null);
          })
        )
        .subscribe(result => {
          this.isLoading = false;
          if (result) {
            this.showSuccess(`TPP organization ${this.isEditMode ? 'updated' : 'created'} successfully`);
            this.router.navigate(['/tpp-orgs']);
          }
        });
    }
  }

  compareTpp(tpp1: TPP, tpp2: TPP): boolean {
    return tpp1?.tppId === tpp2?.tppId;
  }

  compareOrg(org1: Org, org2: Org): boolean {
    return org1?.orgId === org2?.orgId;
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