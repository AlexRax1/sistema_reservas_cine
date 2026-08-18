import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { Booking } from '../../../../core/models/booking.model';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-summary.component.html'
})
export class BookingSummaryComponent implements OnInit {
  booking: Booking | null = null;

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

  formatDate(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-GT', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  formatTime(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
  }

  getSeatTypeLabel(tipo: string): string {
    const labels: Record<string, string> = {
      VIP: 'VIP', NORMAL: 'Estándar', DISCAPACITADO: 'Accesible'
    };
    return labels[tipo] ?? tipo;
  }

  getTicketLabel(tipo: string): string {
    const labels: Record<string, string> = {
      ADULTO: 'Adulto', NINO: 'Niño', TERCERA_EDAD: '3a Edad'
    };
    return labels[tipo] ?? tipo;
  }

  proceedToPayment(): void {
    this.router.navigate(['/reservas/pago']);
  }
}
