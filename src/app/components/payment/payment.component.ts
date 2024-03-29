import { Reservation } from './../../interfaces/reservation';
import { AvailableReservationsService } from './../../services/availableReservations/available-reservations.service';
import { Component, ElementRef, InjectionToken, Input, OnInit, ViewChild, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { loadScript } from "@paypal/paypal-js";
import { ReservationService } from '../../services/reservation/reservation.service';
import { FieldService } from '../../services/field/field.service';
import { UserService } from '../../services/user/user.service';
import { Field } from '../../interfaces/field';
import { AvailableReservation } from '../../interfaces/available-reservation';
import { Observable } from 'rxjs';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {

  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  public activeModal = inject(NgbActiveModal);

  private field!: Field;
  private userId!: number;

  @Input() avResInfo!: AvailableReservation;

  constructor(
    private fieldService: FieldService,
    private userService: UserService,
    private availableReservationService: AvailableReservationsService,
    private reservationService: ReservationService,
    private toastService: ToastService
  ) {
    this.userId = this.userService.userInfo().id;
    this.field = this.fieldService.activeField();
  }

  async ngOnInit() {
    let paypal!: any;

    try {
        paypal = await loadScript({ clientId: "test" });
    } catch (error) {
        console.error("failed to load the PayPal JS SDK script", error);
    }

    if (paypal! && this.avResInfo) {
        try {
            await paypal.Buttons({
              createOrder: (data: any, actions: any) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        currency_code: 'USD',
                        value: this.avResInfo.price
                      }
                    }
                  ]
                })
              },
              onApprove: (data: any) => {
                this.activateReservation();
              },
              onError: (err: any) => {
                this.cancelReservation();
                this.toastService.showDanger('Error during payment process')
              },
              onCancel: (data: any) => {
                this.cancelReservation();
                this.toastService.showDanger('Payment cancelled')
              }
            }).render(this.paypalElement.nativeElement)
        } catch (error) {
            this.toastService.showDanger('Error during payment process')
        }
    }
  }

  activateReservation() {
    this.deleteAvailableReservation().subscribe({
      next: () => {
        this.payReservation();
      },
      error: () => this.toastService.showDanger('Error during reservation process')
    })
  }

  deleteAvailableReservation(): Observable<AvailableReservation> {
    const id = this.avResInfo.id;
    return this.availableReservationService.deleteAvailableReservation(id!);
  }

  payReservation() {
    const reservation: Reservation = {
      field_id: this.field.id!,
      user_id: this.userId,
      date_time_start: this.avResInfo.date_time_start,
      date_time_end: this.avResInfo.date_time_end,
      paid: true,
      amount: this.avResInfo.price,
    }

    this.reservationService.createReservation(reservation).subscribe({
      next: () => {
        this.activeModal.close({ reason: 'approved' })
        this.toastService.showSuccess('Reservation created successfully')
      },
      error: () => {
        this.activeModal.close({ reason: 'cancelled' })
        this.toastService.showDanger('Error during reservation process')
      }
    });
  }

  cancelReservation() {
    this.activeModal.close({ reason: 'cancelled' });
  }

}
