export interface Appointment {
  id:        number;
  clientName: string;
  startTime: string;     // or Date
  endTime:   string;
  notes?:    string;
  confirmed: boolean;
}
