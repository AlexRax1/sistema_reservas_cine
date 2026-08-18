export interface Payment {
  id?: number;
  reservaId: number;
  proveedor: 'STRIPE' | 'PAYPAL';
  transaccionExternaId?: string;
  idempotencyKey?: string;
  monto: number;
  moneda: 'USD';
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'REEMBOLSADO';
  fechaPago?: string;
}
