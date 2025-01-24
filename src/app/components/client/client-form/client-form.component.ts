import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from '../../../services/client.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SqlModalComponent } from '../sql-modal/sql-modal.component';


@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  isEditMode = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.clientForm = this.fb.group({
      clientId: ['', Validators.required],
      clientName: ['', Validators.required],
      clientDesc: [''],
      tppId: ['', Validators.required],
      clientSecret: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      logoUri: [''],
      uri: ['', Validators.pattern('https?://.+')],
      contacts: [[]],
      createdDate: [new Date()],
      createdBy: [''],
      updatedBy: [''],
      updatedDate: [new Date()],
      siteId: ['']
    });
  }

  ngOnInit(): void {
    const clientId = this.route.snapshot.params['id'];
    if (clientId) {
      this.isEditMode = true;
      this.loadClient(clientId);
    }
  }

  addContact(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const contacts = this.clientForm.get('contacts')?.value || [];

    if (value) {
      this.clientForm.patchValue({
        contacts: [...contacts, value]
      });
    }

    event.chipInput!.clear();
  }

  removeContact(contact: string): void {
    const contacts = this.clientForm.get('contacts')?.value || [];
    const updatedContacts = contacts.filter((c: string) => c !== contact);
    this.clientForm.patchValue({ contacts: updatedContacts });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const client = this.clientForm.value;
      if (this.isEditMode) {
        this.clientService.updateClient(client).subscribe(() => {
          this.showSuccess('Client updated successfully');
          this.router.navigate(['/clients']);
        });
      } else {
        this.clientService.createClient(client).subscribe(() => {
          this.showSuccess('Client created successfully');
          this.router.navigate(['/clients']);
        });
      }
    }
  }

  private loadClient(clientId: string): void {
    this.clientService.getClient(clientId).subscribe(client => {
      this.clientForm.patchValue(client);
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

  generateSQL(): void {
    const formValue = this.clientForm.value;
    const dialogData = {
      clientName: formValue.clientName,
      clientDesc: formValue.clientDesc,
      tppId: formValue.tppId,
      createdDate: new Date()
    };

    this.dialog.open(SqlModalComponent, {
      data: dialogData,
      width: '600px'
    });
  }
}
