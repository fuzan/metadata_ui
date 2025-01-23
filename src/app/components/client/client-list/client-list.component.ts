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
    MatCheckboxModule
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
    'contacts',
    'actions'
  ];
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) { }

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
} 