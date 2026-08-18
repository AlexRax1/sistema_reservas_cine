import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { Booking } from '../../../../core/models/booking.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {
  booking: Booking | null = null;
  selectedProvider: 'STRIPE' | 'PAYPAL' = 'STRIPE';
  isProcessing = false;
  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCvv = '';

  constructor(
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.booking = this.bookingService.getCurrentBooking();
    if (!this.booking) {
      this.router.navigate(['/cartelera']);
    }
  }

  get serviceFee(): number {
    return 1.50;
  }

  get totalWithFee(): number {
    return (this.booking?.montoTotal ?? 0) + this.serviceFee;
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 16);
    this.cardNumber = value.replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 3) {
      this.cardExpiry = value.slice(0, 2) + '/' + value.slice(2);
    } else {
      this.cardExpiry = value;
    }
  }

  pay(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;

    setTimeout(() => {
      this.bookingService.confirmPayment(this.selectedProvider).subscribe(() => {
        this.router.navigate(['/reservas/confirmacion']);
      });
    }, 2000);
  }
}
