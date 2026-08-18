export type SeatType = 'NORMAL' | 'VIP' | 'PASILLO';
export type TicketType = 'ADULTO' | 'NINO' | 'TERCERA_EDAD';
export type SeatStatus = 'AVAILABLE' | 'OCCUPIED' | 'SELECTED' | 'LOCKED';

export interface Seat {
  id: number;
  salaId: number;
  fila: string;
  numero: number;
  tipo: SeatType;
  activo: boolean;

  // Campos de estado de UI
  status?: SeatStatus;
  ticketTipo?: TicketType;
  precioCalculado?: number;
}
