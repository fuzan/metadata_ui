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
import { Client } from '../../../models/client.model';
import { ClientService } from '../../../services/client.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
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
    FormsModule
  ]
})
export class ClientListComponent implements OnInit {
  dataSource = new MatTableDataSource<Client>([]);
  selection = new SelectionModel<Client>(true, []);
  displayedColumns: string[] = [
    'select',
    'clientId',
    'clientName',
    'clientDesc',
    'tppId',
    'status',
    'uri',
    'logoUri',
    'contacts',
    'actions'
  ];
  isLoading = false;
  filterColumn = 'clientName';
  filterValue = '';
  filterColumns = [
    { value: 'clientName', label: 'Client Name' },
    { value: 'tppId', label: 'TPP ID' },
    { value: 'status', label: 'Status' }
  ];
  statusOptions = ['active', 'inactive'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource.filterPredicate = (data: Client, filter: string) => {
      const filterObj = JSON.parse(filter);
      const column = filterObj.column as keyof Client;
      const value = String(data[column] || '').toLowerCase();
      return value.includes(filterObj.value.toLowerCase());
    };
  }

  ngOnInit(): void {
    this.loadClients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.getClients()
      .pipe(
        catchError(error => {
          this.showError('Failed to load clients');
          return of([]);
        })
      )
      .subscribe(clients => {
        this.isLoading = false;
        this.dataSource.data = clients;
      });
  }

  deleteClient(id: string): void {
    this.clientService.deleteClient(id)
      .pipe(
        catchError(error => {
          this.showError('Failed to delete client');
          return of(void 0);
        })
      )
      .subscribe(() => {
        this.loadClients();
        this.showSuccess('Client deleted successfully');
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

  deleteSelectedClients() {
    const selectedIds = this.selection.selected.map(client => client.clientId);
    if (selectedIds.length > 0) {
      this.clientService.deleteClients(selectedIds)
        .pipe(
          catchError(error => {
            this.showError('Failed to delete selected clients');
            return of(void 0);
          })
        )
        .subscribe(() => {
          this.loadClients();
          this.selection.clear();
          this.showSuccess('Selected clients deleted successfully');
        });
    }
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