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
import { ClientOrgStatus } from '../../../models/client-org.model';
import { Client } from '../../../models/client.model';
import { Org } from '../../../models/org.model';
import { ClientOrgService } from '../../../services/client-org.service';
import { ClientService } from '../../../services/client.service';
import { OrgService } from '../../../services/org.service';
import { catchError, forkJoin } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-client-org-form',
  templateUrl: './client-org-form.component.html',
  styleUrls: ['./client-org-form.component.css'],
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
export class ClientOrgFormComponent implements OnInit {
  clientOrgForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  clients: Client[] = [];
  orgs: Org[] = [];
  statusOptions = Object.values(ClientOrgStatus);

  constructor(
    private fb: FormBuilder,
    private clientOrgService: ClientOrgService,
    private clientService: ClientService,
    private orgService: OrgService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.clientOrgForm = this.fb.group({
      clientOrgId: [null],
      client: ['', Validators.required],
      org: ['', Validators.required],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSelectOptions();

    const clientOrgId = this.route.snapshot.paramMap.get('id');
    if (clientOrgId) {
      this.isEditMode = true;
      this.loadClientOrg(clientOrgId);
    }
  }

  loadSelectOptions(): void {
    this.isLoading = true;
    forkJoin({
      clients: this.clientService.getClients(),
      orgs: this.orgService.getOrgs()
    }).pipe(
      catchError(error => {
        this.showError('Failed to load form options');
        return of({ clients: [], orgs: [] });
      })
    ).subscribe(result => {
      this.clients = result.clients;
      this.orgs = result.orgs;
      this.isLoading = false;
    });
  }

  loadClientOrg(clientOrgId: string): void {
    this.isLoading = true;
    this.clientOrgService.getClientOrg(clientOrgId)
      .pipe(
        catchError(error => {
          this.showError('Failed to load client organization');
          this.router.navigate(['/client-orgs']);
          return of(null);
        })
      )
      .subscribe(clientOrg => {
        if (clientOrg) {
          this.clientOrgForm.patchValue({
            clientOrgId: clientOrg.clientOrgId,
            client: clientOrg.client,
            org: clientOrg.org,
            status: clientOrg.status
          });
        }
        this.isLoading = false;
      });
  }

  onSubmit(): void {
    if (this.clientOrgForm.valid) {
      this.isLoading = true;
      const clientOrgData = this.clientOrgForm.value;

      // Generate a unique ID for new client-org if not in edit mode
      if (!this.isEditMode && !clientOrgData.clientOrgId) {
        clientOrgData.clientOrgId = `${clientOrgData.client.clientId}_${clientOrgData.org.orgId}`;
      }

      const operation = this.isEditMode
        ? this.clientOrgService.updateClientOrg(clientOrgData)
        : this.clientOrgService.createClientOrg(clientOrgData);

      operation
        .pipe(
          catchError(error => {
            this.showError(error.message || `Failed to ${this.isEditMode ? 'update' : 'create'} client organization`);
            return of(null);
          })
        )
        .subscribe(result => {
          this.isLoading = false;
          if (result) {
            this.showSuccess(`Client organization ${this.isEditMode ? 'updated' : 'created'} successfully`);
            this.router.navigate(['/client-orgs']);
          }
        });
    }
  }

  compareObjects(o1: any, o2: any): boolean {
    if (o1 && o2) {
      return o1.id === o2.id;
    }
    return o1 === o2;
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