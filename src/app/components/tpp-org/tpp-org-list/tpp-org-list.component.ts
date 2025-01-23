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
import { TppOrg } from '../../../models/tpp-org.model';
import { TppOrgService } from '../../../services/tpp-org.service';
import { catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-tpp-org-list',
  templateUrl: './tpp-org-list.component.html',
  styleUrls: ['./tpp-org-list.component.css'],
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
export class TppOrgListComponent implements OnInit {
  dataSource = new MatTableDataSource<TppOrg>([]);
  selection = new SelectionModel<TppOrg>(true, []);
  displayedColumns: string[] = [
    'select',
    'tppOrgId',
    'tppName',
    'orgName',
    'status',
    'actions'
  ];
  isLoading = false;
  filterColumn = 'tppName';
  filterValue = '';
  filterColumns = [
    { value: 'tppName', label: 'TPP Name' },
    { value: 'orgName', label: 'Organization Name' },
    { value: 'status', label: 'Status' }
  ];
  statusOptions = ['ACTIVE', 'INACTIVE'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private tppOrgService: TppOrgService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource.filterPredicate = (data: TppOrg, filter: string) => {
      const filterObj = JSON.parse(filter);
      let value = '';
      
      switch (filterObj.column) {
        case 'tppName':
          value = data.tpp?.tppName || '';
          break;
        case 'orgName':
          value = data.org?.orgName || '';
          break;
        default:
          value = (data[filterObj.column as keyof TppOrg] || '').toString();
      }
      
      return value.toLowerCase().includes(filterObj.value.toLowerCase());
    };
  }

  ngOnInit(): void {
    this.loadTppOrgs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadTppOrgs(): void {
    this.isLoading = true;
    this.tppOrgService.getTppOrgs()
      .pipe(
        catchError(error => {
          this.showError('Failed to load TPP organizations');
          return of([]);
        })
      )
      .subscribe(tppOrgs => {
        this.isLoading = false;
        this.dataSource.data = tppOrgs;
      });
  }

  deleteTppOrg(tppOrgId: string): void {
    this.tppOrgService.deleteTppOrg(tppOrgId)
      .pipe(
        catchError(error => {
          this.showError('Failed to delete TPP organization');
          return of(void 0);
        })
      )
      .subscribe(() => {
        this.loadTppOrgs();
        this.showSuccess('TPP organization deleted successfully');
      });
  }

  deleteSelectedTppOrgs(): void {
    if (this.selection.selected.length === 0) {
      this.showError('Please select TPP organizations to delete');
      return;
    }

    const selectedIds = this.selection.selected.map(tppOrg => tppOrg.tppOrgId);
    this.tppOrgService.deleteTppOrgs(selectedIds)
      .pipe(
        catchError(error => {
          this.showError('Failed to delete selected TPP organizations');
          return of(void 0);
        })
      )
      .subscribe(() => {
        this.loadTppOrgs();
        this.selection.clear();
        this.showSuccess('Selected TPP organizations deleted successfully');
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