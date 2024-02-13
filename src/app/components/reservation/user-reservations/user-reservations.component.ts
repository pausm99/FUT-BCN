import { Component, signal } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { ReservationService } from '../../../services/reservation/reservation.service';
import { Reservation } from '../../../interfaces/reservation';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-reservations',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './user-reservations.component.html',
  styleUrl: './user-reservations.component.scss'
})
export class UserReservationsComponent {

  private userId!: number;
  public reservations: Reservation[] = []

  constructor(private userService: UserService, private reservationService: ReservationService) {
    this.userId = this.userService.userInfo().id;
    this.reservationService.getReservationsByUserId(this.userId).subscribe({
      next: (res) => {
        this.reservations = res;
        this.reservations.sort((a, b) => {
          if (a.date_time_start < b.date_time_start) return 1;
          else return -1
        })
      }
    });
  }

  isExpired(start: Date): boolean {
    const now = new Date();
    return now > start;
  }

}
