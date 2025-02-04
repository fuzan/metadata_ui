import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';
import { Scope } from '../../../models/scope.model';
import { ScopeService } from '../../../services/scope.service';
import { catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-scope-list',
  templateUrl: './scope-list.component.html',
  styleUrls: ['./scope-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTooltipModule
  ]
})
export class ScopeListComponent implements OnInit {
  dataSource = new MatTableDataSource<Scope>([]);
  selection = new SelectionModel<Scope>(true, []);
  displayedColumns: string[] = [
    'select',
    'scopeName',
    'mappingUrl',
    'scopeDesc',
    'actions'
  ];
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private scopeService: ScopeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadScopes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadScopes(): void {
    this.isLoading = true;
    this.scopeService.getScopes()
      .pipe(
        catchError(error => {
          this.showError('Failed to load scopes');
          return of([]);
        })
      )
      .subscribe(scopes => {
        this.isLoading = false;
        this.dataSource.data = scopes;
      });
  }

  deleteScope(id: string): void {
    this.scopeService.deleteScope(id)
      .pipe(
        catchError(error => {
          this.showError('Failed to delete scope');
          return of(void 0);
        })
      )
      .subscribe(() => {
        this.loadScopes();
        this.showSuccess('Scope deleted successfully');
      });
  }

  deleteSelectedScopes(): void {
    if (this.selection.selected.length === 0) {
      this.showError('Please select scopes to delete');
      return;
    }

    const deleteObservables = this.selection.selected.map(scope => 
      this.scopeService.deleteScope(scope.scopeName).pipe(
        catchError(error => {
          this.showError(`Failed to delete scope ${scope.scopeName}`);
          return of(null);
        })
      )
    );

    forkJoin(deleteObservables).subscribe(() => {
      this.loadScopes();
      this.selection.clear();
      this.showSuccess('Selected scopes deleted successfully');
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