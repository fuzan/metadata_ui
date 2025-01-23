import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TPP } from '../../../models/tpp.model';
import { TPPService } from '../../../services/tpp.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
    MatIconModule
  ]
})
export class TPPListComponent implements OnInit {
  tpps: TPP[] = [];
  displayedColumns: string[] = ['id', 'name', 'tppDesc', 'actions'];

  constructor(
    private tppService: TPPService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTPPs();
  }

  loadTPPs(): void {
    this.tppService.getTPPs()
      .pipe(
        catchError(error => {
          this.showError('Failed to load TPPs');
          return of([]);
        })
      )
      .subscribe(tpps => {
        this.tpps = tpps;
      });
  }

  deleteTPP(id: string): void {
    this.tppService.deleteTPP(id)
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
}
