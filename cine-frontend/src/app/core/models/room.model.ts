export interface Room {
  id: number;
  nombre: string;
  tipo: 'NORMAL' | 'VIP' | 'IMAX' | '3D';
  capacidadTotal: number;
  activa: boolean;
}
