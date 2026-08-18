import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Room } from '../models/room.model';
import { Seat, SeatType, TicketType } from '../models/seat.model';
import { Showtime } from '../models/showtime.model';
import { Booking, BookingSeat } from '../models/booking.model';
import { Payment } from '../models/payment.model';
import { MovieService } from './movie.service';
import { environment } from '../../../environments/environment';

/** Genera una fecha ISO a partir de hoy + offsetDays */
function dateOffset(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = `${environment.apiUrl}/api/reservas`;

  private mockRooms: Room[] = [
    { id: 1, nombre: 'Sala 1 — IMAX 4K Laser',       tipo: 'IMAX',   capacidadTotal: 64, activa: true },
    { id: 2, nombre: 'Sala 2 — VIP Premium Lounge',   tipo: 'VIP',    capacidadTotal: 48, activa: true },
    { id: 3, nombre: 'Sala 3 — 3D Dolby Atmos',       tipo: '3D',     capacidadTotal: 64, activa: true },
    { id: 4, nombre: 'Sala 4 — Standard Cinema',      tipo: 'NORMAL', capacidadTotal: 64, activa: true },
  ];

  // ── Estado reactivo global ──────────────────────────────────────────────
  private selectedSeatsSubject   = new BehaviorSubject<Seat[]>([]);
  public  selectedSeats$         = this.selectedSeatsSubject.asObservable();

  private activeShowtimeSubject  = new BehaviorSubject<Showtime | null>(null);
  public  activeShowtime$        = this.activeShowtimeSubject.asObservable();

  private currentBookingSubject  = new BehaviorSubject<Booking | null>(null);
  public  currentBooking$        = this.currentBookingSubject.asObservable();

  constructor(
    private movieService: MovieService,
    private http: HttpClient
  ) {}

  // ── Rooms ───────────────────────────────────────────────────────────────
  getRooms(): Observable<Room[]> {
    return of(this.mockRooms);
  }

  // ── Showtimes ───────────────────────────────────────────────────────────
  /**
   * Genera funciones mock ricas para una película + día concreto.
   * offset: 0 = hoy, 1 = mañana, etc.
   */
  getShowtimesForMovie(movieId: number, dateOffset: number = 0): Observable<Showtime[]> {
    return this.movieService.getMovieById(movieId).pipe(
      map(movie => {
        const d = new Date();
        d.setDate(d.getDate() + dateOffset);
        const dateStr = d.toISOString().split('T')[0];

        const base = (dateOffset + 1) * 10; // id-seed para evitar colisiones entre días

        return [
          {
            id: base + 1,
            peliculaId: movieId,
            salaId: 1,
            fechaHoraInicio: `${dateStr}T14:30:00`,
            fechaHoraFin:    `${dateStr}T17:15:00`,
            precioBase:      12.00,
            asientosDisponibles: 42,
            activa: true,
            pelicula: movie,
            sala: this.mockRooms[0],
          },
          {
            id: base + 2,
            peliculaId: movieId,
            salaId: 1,
            fechaHoraInicio: `${dateStr}T18:30:00`,
            fechaHoraFin:    `${dateStr}T21:15:00`,
            precioBase:      12.00,
            asientosDisponibles: 12,
            activa: true,
            pelicula: movie,
            sala: this.mockRooms[0],
          },
          {
            id: base + 3,
            peliculaId: movieId,
            salaId: 2,
            fechaHoraInicio: `${dateStr}T16:00:00`,
            fechaHoraFin:    `${dateStr}T18:45:00`,
            precioBase:      16.50,
            asientosDisponibles: 20,
            activa: true,
            pelicula: movie,
            sala: this.mockRooms[1],
          },
          {
            id: base + 4,
            peliculaId: movieId,
            salaId: 2,
            fechaHoraInicio: `${dateStr}T21:00:00`,
            fechaHoraFin:    `${dateStr}T23:45:00`,
            precioBase:      16.50,
            asientosDisponibles: 48,
            activa: true,
            pelicula: movie,
            sala: this.mockRooms[1],
          },
          {
            id: base + 5,
            peliculaId: movieId,
            salaId: 3,
            fechaHoraInicio: `${dateStr}T15:00:00`,
            fechaHoraFin:    `${dateStr}T17:45:00`,
            precioBase:      10.00,
            asientosDisponibles: 55,
            activa: true,
            pelicula: movie,
            sala: this.mockRooms[2],
          },
          {
            id: base + 6,
            peliculaId: movieId,
            salaId: 3,
            fechaHoraInicio: `${dateStr}T20:00:00`,
            fechaHoraFin:    `${dateStr}T22:45:00`,
            precioBase:      10.00,
            asientosDisponibles: 30,
            activa: true,
            pelicula: movie,
            sala: this.mockRooms[2],
          },
          {
            id: base + 7,
            peliculaId: movieId,
            salaId: 4,
            fechaHoraInicio: `${dateStr}T13:00:00`,
            fechaHoraFin:    `${dateStr}T15:45:00`,
            precioBase:      8.00,
            asientosDisponibles: 60,
            activa: true,
            pelicula: movie,
            sala: this.mockRooms[3],
          },
          {
            id: base + 8,
            peliculaId: movieId,
            salaId: 4,
            fechaHoraInicio: `${dateStr}T18:00:00`,
            fechaHoraFin:    `${dateStr}T20:45:00`,
            precioBase:      8.00,
            asientosDisponibles: 0, // Agotado — estado visual interesante
            activa: true,
            pelicula: movie,
            sala: this.mockRooms[3],
          },
        ] as Showtime[];
      })
    );
  }

  getShowtimeById(showtimeId: number): Observable<Showtime | undefined> {
    return this.movieService.getMovieById(1).pipe(
      map(movie => {
        const todayStr = new Date().toISOString().split('T')[0];
        return {
          id: showtimeId,
          peliculaId: 1,
          salaId: 1,
          fechaHoraInicio: `${todayStr}T18:00:00`,
          fechaHoraFin:    `${todayStr}T20:45:00`,
          precioBase:      12.00,
          asientosDisponibles: 38,
          activa: true,
          pelicula: movie,
          sala: this.mockRooms[0],
        } as Showtime;
      })
    );
  }

  // ── Seat map ────────────────────────────────────────────────────────────
  /**
   * Layout realista 7 filas × 10 columnas.
   * Columnas 4 y 8 → PASILLO.
   * Fila A col 2,9 → DISCAPACITADO.
   * Filas F-G → VIP.
   */
  getSeatsForShowtime(showtimeId: number, salaId: number = 1): Observable<Seat[]> {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const totalCols = 10;
    const seats: Seat[] = [];
    let idCounter = 1;

    // Asientos ocupados fijos para demo
    const occupied = new Set(['B3','C5','C6','D5','D6','D7','E3','E4','F2','F3','G5','G6']);

    /**
     * BLOQUEO TEMPORAL (Redis — opcional)
     * El backend devuelve status='LOCKED' para asientos que otro usuario tiene
     * reservados temporalmente (TTL ~5 min). Si Redis no está disponible,
     * el backend simplemente no devuelve ningún asiento como LOCKED y el
     * frontend sigue funcionando normalmente. Nunca se rompe sin Redis.
     */
    const locked = new Set(['A5','A6','B7']);  // Simulación: vendrían del backend

    rows.forEach(fila => {
      for (let col = 1; col <= totalCols; col++) {
        let tipo: SeatType = 'NORMAL';

        if (col === 4 || col === 8) {
          tipo = 'PASILLO';
        } else if (fila === 'F' || fila === 'G') {
          tipo = 'VIP';
        }

        const code = `${fila}${col}`;
        const isOccupied = occupied.has(code);

        seats.push({
          id: idCounter++,
          salaId,
          fila,
          numero: col,
          tipo,
          activo: true,
          status: tipo === 'PASILLO'
            ? 'AVAILABLE'
            : isOccupied
            ? 'OCCUPIED'
            : locked.has(code)
            ? 'LOCKED'   // bloqueado temporalmente (Redis); si Redis no está up, simplemente no aparece
            : 'AVAILABLE',
          ticketTipo: 'ADULTO',
          precioCalculado: 0,
        });
      }
    });

    return of(seats);
  }

  // ── State setters ───────────────────────────────────────────────────────
  setActiveShowtime(showtime: Showtime): void {
    this.activeShowtimeSubject.next(showtime);
  }

  setSelectedSeats(seats: Seat[]): void {
    this.selectedSeatsSubject.next(seats);
  }

  updateSeatTicketType(seatId: number, ticketTipo: TicketType): void {
    const updated = this.selectedSeatsSubject.getValue().map(s =>
      s.id === seatId ? { ...s, ticketTipo } : s
    );
    this.selectedSeatsSubject.next(updated);
  }

  // ── Pricing ─────────────────────────────────────────────────────────────
  calculateSeatPrice(seat: Seat, showtime: Showtime | null): number {
    if (!showtime) return 10.00;
    let price = showtime.precioBase;
    if (seat.tipo === 'VIP') price += 4.00;
    if (seat.ticketTipo === 'NINO')         price *= 0.80;
    else if (seat.ticketTipo === 'TERCERA_EDAD') price *= 0.75;
    return Math.round(price * 100) / 100;
  }

  // ── Booking ─────────────────────────────────────────────────────────────
  prepareBooking(showtime: Showtime, seats: Seat[]): Booking {
    const bookingSeats: BookingSeat[] = seats.map(s => ({
      asientoId: s.id,
      fila: s.fila,
      numero: s.numero,
      tipoAsiento: s.tipo as any,
      tipoTicket: s.ticketTipo || 'ADULTO',
      precio: this.calculateSeatPrice(s, showtime),
    }));

    const booking: Booking = {
      usuarioId:     1,
      funcionId:     showtime.id,
      estado:        'PENDIENTE',
      montoTotal:    bookingSeats.reduce((sum, s) => sum + s.precio, 0),
      codigoReserva: 'CIN-' + Math.floor(100000 + Math.random() * 900000),
      asientos:      bookingSeats,
      funcion:       showtime,
    };

    this.currentBookingSubject.next(booking);
    return booking;
  }

  getCurrentBooking(): Booking | null {
    return this.currentBookingSubject.getValue();
  }

  confirmPayment(provider: 'STRIPE' | 'PAYPAL'): Observable<{ success: boolean; payment: Payment; booking: Booking }> {
    const booking = this.currentBookingSubject.getValue();
    if (!booking) throw new Error('No hay reserva activa');

    booking.estado = 'CONFIRMADA';

    const payment: Payment = {
      id:                   Math.floor(Math.random() * 10000),
      reservaId:            booking.id || 1,
      proveedor:            provider,
      transaccionExternaId: 'tx_' + Math.random().toString(36).substring(2, 12),
      idempotencyKey:       'idemp_' + Math.random().toString(36).substring(2, 12),
      monto:                booking.montoTotal + 1.50,
      moneda:               'USD',
      estado:               'APROBADO',
      fechaPago:            new Date().toISOString(),
    };

    this.currentBookingSubject.next(booking);
    return of({ success: true, payment, booking });
  }
}
