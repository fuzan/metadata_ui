import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { TPP, TPPStatus } from '../../../models/tpp.model';
import { TPPService } from '../../../services/tpp.service';
import { catchError } from 'rxjs/operators';
import { of,forkJoin } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tpp-list',
  templateUrl: './tpp-list.component.html',
  styleUrls: ['./tpp-list.component.css'],
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
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ]
})
export class TPPListComponent implements OnInit {
  dataSource = new MatTableDataSource<TPP>([]);
  selection = new SelectionModel<TPP>(true, []);
  displayedColumns: string[] = [
    'select',
    'tppId',
    'tppName',
    'tppType',
    'verifiedClient',
    'scopeNameList',
    'tppDesc',
    'contactName',
    'contactEmail',
    'status',
    'actions'
  ];
  isLoading = false;
  filterColumn = 'tppName';
  filterValue = '';
  filterColumns = [
    { value: 'tppName', label: 'TPP Name' },
    { value: 'tppType', label: 'TPP Type' },
    { value: 'status', label: 'Status' }
  ];
  statusOptions = Object.values(TPPStatus);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private tppService: TPPService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource.filterPredicate = (data: TPP, filter: string) => {
      const filterObj = JSON.parse(filter);
      const column = filterObj.column as keyof TPP;
      const value = String(data[column] || '').toLowerCase();
      return value.includes(filterObj.value.toLowerCase());
    };
  }

  ngOnInit(): void {
    this.loadTPPs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadTPPs(): void {
    this.isLoading = true;
    this.tppService.getTPPs()
      .pipe(
        catchError(error => {
          this.showError('Failed to load TPPs');
          return of([]);
        })
      )
      .subscribe(tpps => {
        this.isLoading = false;
        this.dataSource.data = tpps;
      });
  }

  deleteTPP(tppId: string): void {
    this.tppService.deleteTPP(tppId)
      .pipe(
        catchError(error => {
          this.showError('Failed to delete TPP');
          return of(void 0);
        })
      )
      .subscribe(() => {
        this.loadTPPs();
        this.showSuccess('TPP deleted successfully');
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

  /** Whether the number of selected elements matches the total number of rows */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** Delete selected TPPs in batch */
  deleteSelectedTPPs() {
    if (this.selection.selected.length === 0) {
      this.showError('Please select TPPs to delete');
      return;
    }

    const deleteObservables = this.selection.selected.map(tpp => 
      this.tppService.deleteTPP(tpp.tppId).pipe(
        catchError(error => {
          this.showError(`Failed to delete TPP ${tpp.tppName}`);
          return of(null);
        })
      )
    );

    forkJoin(deleteObservables).subscribe(() => {
      this.loadTPPs();
      this.selection.clear();
      this.showSuccess('Selected TPPs deleted successfully');
    });
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