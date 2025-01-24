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
  sql: string;

  constructor(
    public dialogRef: MatDialogRef<SqlModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      tppName: string;
      tppDesc: string;
      tppType: string;
      createdDate: Date;
    },
    private snackBar: MatSnackBar
  ) {
    this.sql = this.generateSQL();
  }

  private generateSQL(): string {
    const { tppName, tppDesc, tppType, createdDate } = this.data;
    const formattedDate = createdDate.toISOString().slice(0, 19).replace('T', ' ');

    return `INSERT INTO tpp (
    tpp_name,
    tpp_desc,
    tpp_type,
    created_date,
    updated_date,
    status
) VALUES (
    '${tppName}',
    '${tppDesc || ''}',
    '${tppType}',
    '${formattedDate}',
    '${formattedDate}',
    'active'
);`;
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.sql).then(() => {
      this.snackBar.open('SQL copied to clipboard', 'Close', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    });
  }

  close(): void {
    this.dialogRef.close();
  }
} 