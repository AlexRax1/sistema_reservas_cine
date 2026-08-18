import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Seat, TicketType } from '../../../../core/models/seat.model';
import { Showtime } from '../../../../core/models/showtime.model';
import { BookingService } from '../../../../core/services/booking.service';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './seat-selection.component.html'
})
export class SeatSelectionComponent implements OnInit {
  showtime?: Showtime;
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  rows: { fila: string; seats: Seat[] }[] = [];

  constructor(
    private router: Router,
    public bookingService: BookingService
  ) {}

  ngOnInit(): void {
    // Obtiene la función activa guardada en el servicio (set desde MovieDetail)
    this.bookingService.activeShowtime$.subscribe(st => {
      if (!st) {
        // Si no hay función activa, redirigir a cartelera
        this.router.navigate(['/cartelera']);
        return;
      }
      this.showtime = st;
      this.bookingService.getSeatsForShowtime(st.id, st.salaId).subscribe(list => {
        this.seats = list;
        this.groupSeatsByRow(list);
      });
    });
  }

  groupSeatsByRow(list: Seat[]): void {
    const rowMap = new Map<string, Seat[]>();
    list.forEach(seat => {
      if (!rowMap.has(seat.fila)) rowMap.set(seat.fila, []);
      rowMap.get(seat.fila)?.push(seat);
    });
    this.rows = Array.from(rowMap.entries()).map(([fila, seats]) => ({
      fila,
      seats: seats.sort((a, b) => a.numero - b.numero)
    }));
  }

  toggleSeatSelection(seat: Seat): void {
    if (seat.tipo === 'PASILLO' || seat.status === 'OCCUPIED' || seat.status === 'LOCKED') return;
    if (seat.status === 'SELECTED') {
      seat.status = 'AVAILABLE';
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    } else {
      seat.status = 'SELECTED';
      seat.ticketTipo = seat.ticketTipo || 'ADULTO';
      this.selectedSeats.push(seat);
    }
    this.bookingService.setSelectedSeats(this.selectedSeats);
  }

  updateTicketType(seat: Seat, event: Event): void {
    const ticketTipo = (event.target as HTMLSelectElement).value as TicketType;
    seat.ticketTipo = ticketTipo;
    this.bookingService.updateSeatTicketType(seat.id, ticketTipo);
  }

  getSeatPrice(seat: Seat): number {
    return this.bookingService.calculateSeatPrice(seat, this.showtime || null);
  }

  getTotalPrice(): number {
    return this.selectedSeats.reduce((sum, s) => sum + this.getSeatPrice(s), 0);
  }

  proceedToCheckout(): void {
    if (this.selectedSeats.length === 0 || !this.showtime) return;
    this.bookingService.prepareBooking(this.showtime, this.selectedSeats);
    // En la Fase 2 primero iremos a login si no está autenticado
    this.router.navigate(['/reservas/resumen']);
  }
}
