import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { Booking } from '../../../../core/models/booking.model';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit {
  booking: Booking | null = null;
  showAnimation = false;

  // Fake QR code pattern (8x8 = 64 cells)
  qrPattern: boolean[] = [
    true,true,true,true,true,true,true,true,
    true,false,false,true,false,false,false,true,
    true,false,true,false,true,false,false,true,
    true,false,false,true,false,true,false,true,
    true,true,false,false,true,false,true,true,
    true,false,true,false,false,true,false,true,
    true,false,false,true,false,false,false,true,
    true,true,true,true,true,true,true,true,
  ];

  constructor(
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.booking = this.bookingService.getCurrentBooking();
    if (!this.booking) {
      this.router.navigate(['/cartelera']);
      return;
    }
    setTimeout(() => { this.showAnimation = true; }, 100);
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

  getSeatLabel(seat: { fila: string; numero: number }): string {
    return `${seat.fila}${seat.numero}`;
  }

  goHome(): void {
    this.router.navigate(['/cartelera']);
  }
}
