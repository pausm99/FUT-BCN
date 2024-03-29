import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Event } from '../../interfaces/event';
import { environment } from '../../../environments/environment';
import { ToastService } from '../toast/toast.service';

const API_URL: string = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient, private toastService: ToastService) { }

  public activeEvent = signal<Event>({
    name: '',
    reservation_id: 0,
    field_id: 0,
    user_id: 0,
    date_time_start: new Date(),
    date_time_end: new Date(),
    incomplete: false,
    max_players: 0
  });

  public events = signal<Event[]>([]);

  createEvent(event: Event) {
    this.http.post<Event>(`${API_URL}/events`, event).subscribe({
      next: (result) => {
        this.toastService.showSuccess('Event successfully created');
        this.events.update((currentEvents) => [...currentEvents, result])
      },
      error: () => this.toastService.showDanger('Failed to create new event')
    })
  }

  getEventById(id: number) {
    return this.http.get<Event>(`${API_URL}/events/${id}`);
  }

  getEvents() {
    this.http.get<Event[]>(`${API_URL}/events`).subscribe({
      next: (result) => {
        this.events.set(result);
      },
      error: () => this.toastService.showDanger('Failed to load events')
    });
  }

  getPlayersEnrolled(id: number, user_id: number) {
    return this.http.get(`${API_URL}/events/players`, { params: {event_id: id, user_id: user_id} })
  }

  joinEvent(event_id: number, user_id: number) {

    const body = { user_id: user_id };

    return this.http.post(`${API_URL}/events/join/${event_id}`, body);
  }

  unEnrollEvent(id: number, user_id: number) {

    return this.http.delete(`${API_URL}/events/unenroll/${id}`, { params: { user_id: user_id } });
  }
}
