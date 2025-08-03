import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Basic ' + btoa('admin:admin123')
    })
  };

  constructor(private http: HttpClient) {}

  listAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl, this.httpOptions);
  }

  get(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(
      `${this.baseUrl}/${id}`,
      this.httpOptions
    );
  }

  create(appt: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(
      this.baseUrl,
      appt,
      this.httpOptions
    );
  }

  update(id: number, appt: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${this.baseUrl}/${id}`,
      appt,
      this.httpOptions
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`,
      this.httpOptions
    );
  }
}
