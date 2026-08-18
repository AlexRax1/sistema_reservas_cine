import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Booking } from '../../../../core/models/booking.model';
import { Payment } from '../../../../core/models/payment.model';
import { BookingService } from '../../../../core/services/booking.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  booking: Booking | null = null;
  selectedProvider: 'STRIPE' | 'PAYPAL' = 'STRIPE';

  // Datos del formulario de tarjeta (Mock)
  cardName: string = 'Alex Rodríguez';
  cardNumber: string = '4532 •••• •••• 8892';
  cardExp: string = '12/28';
  cardCvc: string = '341';
  promoCode: string = '';
  discountAmount: number = 0;

  isProcessing: boolean = false;
  isConfirmed: boolean = false;
  confirmedPayment?: Payment;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.booking = this.bookingService.getCurrentBooking();

    // Si no hay reserva activa, redirigir a cartelera
    if (!this.booking || this.booking.asientos.length === 0) {
      this.router.navigate(['/movies']);
    }
  }

  applyPromo(): void {
    if (this.promoCode.trim().toUpperCase() === 'CINE2026' && this.booking) {
      this.discountAmount = Math.round(this.booking.montoTotal * 0.10 * 100) / 100; // 10% desc
    } else {
      this.discountAmount = 0;
    }
  }

  getFinalTotal(): number {
    if (!this.booking) return 0;
    const subtotal = this.booking.montoTotal;
    const serviceFee = 1.50;
    return Math.max(0, subtotal + serviceFee - this.discountAmount);
  }

  processPayment(): void {
    if (!this.booking || this.isProcessing) return;

    this.isProcessing = true;

    // Simular latencia de pasarela de pago (Stripe / PayPal)
    setTimeout(() => {
      this.bookingService.confirmPayment(this.selectedProvider).subscribe({
        next: (result) => {
          this.isProcessing = false;
          this.isConfirmed = true;
          this.confirmedPayment = result.payment;
          this.booking = result.booking;
        },
        error: () => {
          this.isProcessing = false;
        }
      });
    }, 1500);
  }

  printTicket(): void {
    window.print();
  }
}
