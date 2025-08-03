import { Component }          from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { AppointmentService } from './services/appointment.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrls:   ['./app.component.scss']
})
export class AppComponent {
  appointments: any[] = [];
  newClientName = '';
  newStartTime = '';
  newEndTime = '';
  newNotes = '';
  loading = false;
  error: string | null = null;

  constructor(private svc: AppointmentService) {}

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.error   = null;
    this.svc.listAll().subscribe({
      next: data => { this.appointments = data; this.loading = false; },
      error: err => { this.error = err.message || 'Error loading'; this.loading = false; }
    });
  }

  add() {
    if (!this.newClientName || !this.newStartTime || !this.newEndTime) return;
    this.loading = true;
    const payload = {
      clientName: this.newClientName,
      startTime:  this.newStartTime,
      endTime:    this.newEndTime,
      notes:      this.newNotes,
      confirmed:  false
    };
    this.svc.create(payload as any).subscribe({
      next: appt => {
        this.appointments.push(appt);
        this.newClientName = this.newStartTime = this.newEndTime = this.newNotes = '';
        this.loading = false;
      },
      error: err => {
        this.error = err.message || 'Error creating';
        this.loading = false;
      }
    });
  }

  confirm(appt: any) {
    appt.confirmed = true;
    this.svc.update(appt.id, appt).subscribe();
  }

  delete(id: number) {
    this.svc.delete(id).subscribe(() => {
      this.appointments = this.appointments.filter(a => a.id !== id);
    });
  }
}