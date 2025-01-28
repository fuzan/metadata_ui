import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
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
import { Org, OrgStatus } from '../../../models/org.model';
import { OrgService } from '../../../services/org.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-org-list',
  templateUrl: './org-list.component.html',
  styleUrls: ['./org-list.component.css'],
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
export class OrgListComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSource = new MatTableDataSource<Org>([]);
  selection = new SelectionModel<Org>(true, []);
  displayedColumns: string[] = [
    'select',
    'orgId',
    'orgName',
    'orgDesc',
    'status',
    'customerIdTypeCode',
    'actions'
  ];
  isLoading = false;
  filterColumn = 'orgName';
  filterValue = '';
  filterColumns = [
    { value: 'orgName', label: 'Organization Name' },
    { value: 'orgId', label: 'Organization ID' },
    { value: 'status', label: 'Status' },
    { value: 'customerIdTypeCode', label: 'Customer ID Type Code' }
  ];
  statusOptions = Object.values(OrgStatus);
  private isResizing = false;
  private currentResizeIndex: number = -1;
  private startX: number = 0;
  private startWidth: number = 0;
  private table: HTMLElement | null = null;
  private pressed = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  constructor(
    private orgService: OrgService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private el: ElementRef
  ) {
    this.dataSource.filterPredicate = (data: Org, filter: string) => {
      const filterObj = JSON.parse(filter);
      const column = filterObj.column as keyof Org;
      const value = String(data[column] || '').toLowerCase();
      return value.includes(filterObj.value.toLowerCase());
    };
  }

  ngOnInit(): void {
    this.loadOrgs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    setTimeout(() => {
      this.setupResizeListeners();
    });
  }

  ngOnDestroy() {
    this.removeResizeListeners();
  }

  private setupResizeListeners() {
    this.table = this.el.nativeElement.querySelector('mat-table');
    
    if (this.table) {
      document.addEventListener('mousemove', this.onMouseMove.bind(this));
      document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }
  }

  private removeResizeListeners() {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onResizeColumn(event: MouseEvent, index: number) {
    event.preventDefault();
    event.stopPropagation();

    this.pressed = true;
    this.isResizing = true;
    this.currentResizeIndex = index;
    this.startX = event.pageX;

    const headerRow = this.table?.querySelector('mat-header-row');
    if (headerRow) {
      const headerCell = headerRow.children[index] as HTMLElement;
      this.startWidth = headerCell.offsetWidth;
    }
  }

  private onMouseMove = (event: MouseEvent) => {
    if (!this.pressed || !this.isResizing) return;

    this.ngZone.runOutsideAngular(() => {
      const headerRow = this.table?.querySelector('mat-header-row');
      if (headerRow) {
        const headerCell = headerRow.children[this.currentResizeIndex] as HTMLElement;
        if (headerCell) {
          const width = Math.max(this.startWidth + (event.pageX - this.startX), 100);
          const columnClass = `mat-column-${this.displayedColumns[this.currentResizeIndex]}`;
          
          // Update header cell width
          headerCell.style.width = `${width}px`;
          headerCell.style.minWidth = `${width}px`;
          
          // Update all body cells in the same column
          const cells = this.table?.querySelectorAll(`.${columnClass}`);
          cells?.forEach((cell: Element) => {
            (cell as HTMLElement).style.width = `${width}px`;
            (cell as HTMLElement).style.minWidth = `${width}px`;
          });
        }
      }
    });
  }

  private onMouseUp = () => {
    if (this.isResizing) {
      this.isResizing = false;
      this.pressed = false;
      this.currentResizeIndex = -1;
    }
  }

  loadOrgs(): void {
    this.isLoading = true;
    this.orgService.getOrgs()
      .pipe(
        catchError(error => {
          this.showError('Failed to load organizations');
          return of([]);
        })
      )
      .subscribe(orgs => {
        this.isLoading = false;
        this.dataSource.data = orgs;
      });
  }

  deleteOrg(orgId: string): void {
    this.orgService.deleteOrg(orgId)
      .pipe(
        catchError(error => {
          this.showError('Failed to delete organization');
          return of(void 0);
        })
      )
      .subscribe(() => {
        this.loadOrgs();
        this.showSuccess('Organization deleted successfully');
      });
  }

  deleteSelectedOrgs(): void {
    if (this.selection.selected.length === 0) {
      this.showError('Please select organizations to delete');
      return;
    }

    const selectedIds = this.selection.selected.map(org => org.orgId);
    this.orgService.deleteOrgs(selectedIds)
      .pipe(
        catchError(error => {
          this.showError('Failed to delete selected organizations');
          return of(void 0);
        })
      )
      .subscribe(() => {
        this.loadOrgs();
        this.selection.clear();
        this.showSuccess('Selected organizations deleted successfully');
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