import { Showtime } from './showtime.model';
import { TicketType } from './seat.model';

export interface BookingSeat {
  id?: number;
  reservaId?: number;
  asientoId: number;
  fila: string;
  numero: number;
  tipoAsiento: 'NORMAL' | 'VIP' | 'DISCAPACITADO';
  tipoTicket: TicketType;
  precio: number;
}

export interface Booking {
  id?: number;
  usuarioId: number;
  funcionId: number;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'EXPIRADA';
  montoTotal: number;
  fechaExpiracion?: string;
  fechaCreacion?: string;
  codigoReserva?: string;
  asientos: BookingSeat[];
  funcion?: Showtime;
}