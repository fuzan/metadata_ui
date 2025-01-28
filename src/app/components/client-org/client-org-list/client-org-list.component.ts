import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { ClientOrg, ClientOrgStatus } from '../../../models/client-org.model';
import { ClientOrgService } from '../../../services/client-org.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-client-org-list',
  templateUrl: './client-org-list.component.html',
  styleUrls: ['./client-org-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatDialogModule
  ]
})
export class ClientOrgListComponent implements OnInit {
  dataSource = new MatTableDataSource<ClientOrg>([]);
  selection = new SelectionModel<ClientOrg>(true, []);
  displayedColumns: string[] = [
    'select',
    'clientOrgId',
    'client',
    'org',
    'status',
    'actions'
  ];
  isLoading = false;
  filterColumn = 'client.clientName';
  filterValue = '';
  filterColumns = [
    { value: 'client.clientName', label: 'Client Name' },
    { value: 'org.orgName', label: 'Organization Name' },
    { value: 'status', label: 'Status' }
  ];
  statusOptions = Object.values(ClientOrgStatus);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private clientOrgService: ClientOrgService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dataSource.filterPredicate = (data: ClientOrg, filter: string) => {
      const filterObj = JSON.parse(filter);
      const value = filterObj.value.toLowerCase();
      
      switch (filterObj.column) {
        case 'client.clientName':
          return data.client.clientName.toLowerCase().includes(value);
        case 'org.orgName':
          return data.org.orgName.toLowerCase().includes(value);
        case 'status':
          return data.status.toLowerCase().includes(value);
        default:
          return false;
      }
    };
  }

  ngOnInit(): void {
    this.loadClientOrgs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadClientOrgs(): void {
    this.isLoading = true;
    this.clientOrgService.getClientOrgs()
      .pipe(
        catchError(error => {
          this.showError('Failed to load client organizations');
          return of([]);
        })
      )
      .subscribe(clientOrgs => {
        this.isLoading = false;
        this.dataSource.data = clientOrgs;
      });
  }

  deleteClientOrg(clientOrgId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this client organization?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientOrgService.deleteClientOrg(clientOrgId)
          .pipe(
            catchError(error => {
              this.showError('Failed to delete client organization');
              return of(void 0);
            })
          )
          .subscribe(() => {
            this.loadClientOrgs();
            this.showSuccess('Client organization deleted successfully');
          });
      }
    });
  }

  deleteSelectedClientOrgs(): void {
    if (this.selection.selected.length === 0) {
      this.showError('Please select client organizations to delete');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Batch Delete',
        message: `Are you sure you want to delete ${this.selection.selected.length} selected client organizations?`,
        confirmText: 'Delete All',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedIds = this.selection.selected.map(clientOrg => clientOrg.clientOrgId);
        this.clientOrgService.deleteClientOrgs(selectedIds)
          .pipe(
            catchError(error => {
              this.showError('Failed to delete selected client organizations');
              return of(void 0);
            })
          )
          .subscribe(() => {
            this.loadClientOrgs();
            this.selection.clear();
            this.showSuccess('Selected client organizations deleted successfully');
          });
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  applyFilter() {
    const filterValue = {
      column: this.filterColumn,
      value: this.filterValue
    };
    this.dataSource.filter = JSON.stringify(filterValue);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter() {
    this.filterValue = '';
    this.applyFilter();
  }
} 