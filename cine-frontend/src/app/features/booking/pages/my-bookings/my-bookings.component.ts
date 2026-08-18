import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface MockBooking {
  id: number;
  codigoReserva: string;
  pelicula: string;
  sala: string;
  fecha: string;
  hora: string;
  asientos: string[];
  total: number;
  estado: 'CONFIRMADA' | 'PENDIENTE' | 'CANCELADA';
  poster: string;
}

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html'
})
export class MyBookingsComponent implements OnInit {
  activeTab: 'activas' | 'historial' = 'activas';
  bookings: MockBooking[] = [];

  ngOnInit(): void {
    this.bookings = [
      {
        id: 1,
        codigoReserva: 'CIN-482910',
        pelicula: 'Dune: Parte Dos',
        sala: 'Sala 1 — IMAX 4K Laser',
        fecha: this.futureDateStr(2),
        hora: '18:30',
        asientos: ['F5', 'F6', 'F7'],
        total: 49.50,
        estado: 'CONFIRMADA',
        poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'
      },
      {
        id: 2,
        codigoReserva: 'CIN-371205',
        pelicula: 'Oppenheimer',
        sala: 'Sala 2 — VIP Premium Lounge',
        fecha: this.futureDateStr(5),
        hora: '21:00',
        asientos: ['C3', 'C4'],
        total: 33.00,
        estado: 'CONFIRMADA',
        poster: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg'
      },
      {
        id: 3,
        codigoReserva: 'CIN-193847',
        pelicula: 'Avengers: Secret Wars',
        sala: 'Sala 3 — 3D Dolby Atmos',
        fecha: this.pastDateStr(10),
        hora: '15:00',
        asientos: ['D7', 'D8'],
        total: 20.00,
        estado: 'CONFIRMADA',
        poster: 'https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg'
      },
      {
        id: 4,
        codigoReserva: 'CIN-552031',
        pelicula: 'Alien: Romulus',
        sala: 'Sala 4 — Standard Cinema',
        fecha: this.pastDateStr(25),
        hora: '20:00',
        asientos: ['B2'],
        total: 8.00,
        estado: 'CANCELADA',
        poster: 'https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg'
      }
    ];
  }

  get activeBookings(): MockBooking[] {
    const now = new Date();
    return this.bookings.filter(b => {
      const fecha = new Date(b.fecha + 'T' + b.hora);
      return fecha >= now && b.estado !== 'CANCELADA';
    });
  }

  get historialBookings(): MockBooking[] {
    const now = new Date();
    return this.bookings.filter(b => {
      const fecha = new Date(b.fecha + 'T' + b.hora);
      return fecha < now || b.estado === 'CANCELADA';
    });
  }

  futureDateStr(daysFromNow: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
  }

  pastDateStr(daysAgo: number): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es-GT', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      CONFIRMADA: 'Confirmada',
      PENDIENTE: 'Pendiente',
      CANCELADA: 'Cancelada'
    };
    return labels[estado] ?? estado;
  }
}
