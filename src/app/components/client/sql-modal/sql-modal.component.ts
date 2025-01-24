import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sql-modal',
  templateUrl: './sql-modal.component.html',
  styleUrls: ['./sql-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class SqlModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SqlModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      clientName: string;
      clientDesc: string;
      tppId: string;
      createdDate: Date;
    },
    private snackBar: MatSnackBar
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }

  copyToClipboard(): void {
    const sql = `INSERT INTO client (client_name, client_desc, tpp_id, created_date)
VALUES (
  '${this.data.clientName}',
  '${this.data.clientDesc}',
  '${this.data.tppId}',
  '${this.data.createdDate.toISOString().slice(0, 19).replace('T', ' ')}'
);`;

    navigator.clipboard.writeText(sql).then(() => {
      this.snackBar.open('SQL copied to clipboard', 'Close', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    });
  }
} 