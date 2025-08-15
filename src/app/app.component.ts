import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from './services/appointment.service';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // PrimeNG Modules
    CardModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    ButtonModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    DividerModule,
    RippleModule,
    AnimateOnScrollModule,
    ProgressSpinnerModule,
    MessageModule,
    TooltipModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appointments: any[] = [];
  newClientName = '';
  newStartTime: Date | null = null;
  newEndTime: Date | null = null;
  newNotes = '';
  loading = false;
  error: string | null = null;
  minDate: Date = new Date();

  constructor(
    private svc: AppointmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.error = null;
    this.svc.listAll().subscribe({
      next: data => { 
        console.log('Fetched appointments:', data);
        this.appointments = data; 
        this.loading = false;
      },
      error: err => { 
        this.error = err.message || 'Error loading appointments';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.error ?? undefined,
          life: 5000
        });
      }
    });
  }

  add() {
    if (!this.newClientName || !this.newStartTime || !this.newEndTime) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
        life: 3000
      });
      return;
    }

    if (this.newEndTime <= this.newStartTime) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'End time must be after start time',
        life: 3000
      });
      return;
    }

    this.loading = true;
    const payload = {
      clientName: this.newClientName,
      startTime: this.newStartTime instanceof Date ? this.newStartTime.toISOString() : this.newStartTime,
      endTime: this.newEndTime instanceof Date ? this.newEndTime.toISOString() : this.newEndTime,
      notes: this.newNotes,
      confirmed: false
    };

    this.svc.create(payload as any).subscribe({
      next: appt => {
        console.log('Created appointment:', appt);
        console.log('Current appointments before adding:', this.appointments);
        this.appointments.unshift(appt); // Add to beginning for better visibility
        console.log('Current appointments after adding:', this.appointments);
        this.newClientName = '';
        this.newStartTime = null;
        this.newEndTime = null;
        this.newNotes = '';
        this.loading = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Appointment created successfully',
          life: 3000
        });
      },
      error: err => {
        this.error = err.message || 'Error creating appointment';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.error ?? undefined,
          life: 5000
        });
      }
    });
  }

  confirm(appt: any) {
    appt.confirmed = true;
    this.svc.update(appt.id, appt).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: `Appointment for ${appt.clientName} has been confirmed`,
          life: 3000
        });
      },
      error: err => {
        appt.confirmed = false; // Revert on error
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to confirm appointment',
          life: 3000
        });
      }
    });
  }

  delete(id: number, clientName: string) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the appointment for ${clientName}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.svc.delete(id).subscribe({
          next: () => {
            this.appointments = this.appointments.filter(a => a.id !== id);
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Appointment deleted successfully',
              life: 3000
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete appointment',
              life: 3000
            });
          }
        });
      }
    });
  }

  getSeverity(confirmed: boolean): "success" | "warning" {
    return confirmed ? 'success' : 'warning';
  }

  getStatusLabel(confirmed: boolean): string {
    return confirmed ? 'Confirmed' : 'Pending';
  }
}