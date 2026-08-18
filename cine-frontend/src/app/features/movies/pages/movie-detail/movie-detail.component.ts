import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Movie } from '../../../../core/models/movie.model';
import { Showtime } from '../../../../core/models/showtime.model';
import { MovieService } from '../../../../core/services/movie.service';
import { BookingService } from '../../../../core/services/booking.service';

interface DateTab {
  label: string;
  shortLabel: string;
  dayName: string;
  dateStr: string;
  offset: number;
}

interface ShowtimeGroup {
  roomName: string;
  roomType: string;
  showtimes: Showtime[];
}

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-detail.component.html'
})
export class MovieDetailComponent implements OnInit {
  movie?: Movie;
  allShowtimes: Showtime[] = [];
  groupedShowtimes: ShowtimeGroup[] = [];
  relatedMovies: Movie[] = [];

  selectedDateIndex = 0;
  dateTabs: DateTab[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.buildDateTabs();

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadMovie(id);
        this.loadShowtimes(id, 0);
        this.loadRelated(id);
      }
    });
  }

  /** Construye los tabs de fecha: hoy + 4 días más */
  private buildDateTabs(): void {
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months   = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

    this.dateTabs = Array.from({ length: 5 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayN = dayNames[d.getDay()];
      const dom  = d.getDate();
      const mes  = months[d.getMonth()];
      return {
        offset:     i,
        dateStr:    d.toISOString().split('T')[0],
        dayName:    dayN,
        shortLabel: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : `${dom} ${mes}`,
        label:      i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : `${dayN} ${dom} ${mes}`,
      };
    });
  }

  loadMovie(id: number): void {
    this.movieService.getMovieById(id).subscribe(m => (this.movie = m));
  }

  loadShowtimes(movieId: number, dateOffset: number): void {
    this.bookingService.getShowtimesForMovie(movieId, dateOffset).subscribe(list => {
      this.allShowtimes = list;
      this.groupedShowtimes = this.groupByRoom(list);
    });
  }

  loadRelated(currentId: number): void {
    this.movieService.getMoviesEnCartelera().subscribe(movies => {
      this.relatedMovies = movies.filter(m => m.id !== currentId).slice(0, 4);
    });
  }

  /** Agrupa funciones por sala */
  private groupByRoom(showtimes: Showtime[]): ShowtimeGroup[] {
    const map = new Map<string, ShowtimeGroup>();
    showtimes.forEach(st => {
      const key = st.sala?.nombre ?? 'Sala';
      if (!map.has(key)) {
        map.set(key, { roomName: key, roomType: st.sala?.tipo ?? 'NORMAL', showtimes: [] });
      }
      map.get(key)!.showtimes.push(st);
    });
    // Orden: IMAX → VIP → 3D → NORMAL
    const order: Record<string, number> = { IMAX: 0, VIP: 1, '3D': 2, NORMAL: 3 };
    return Array.from(map.values()).sort((a, b) => (order[a.roomType] ?? 9) - (order[b.roomType] ?? 9));
  }

  selectDate(index: number): void {
    this.selectedDateIndex = index;
    const movieId = this.movie?.id ?? Number(this.route.snapshot.paramMap.get('id'));
    this.loadShowtimes(movieId, this.dateTabs[index].offset);
  }

  selectShowtime(showtime: Showtime): void {
    if (showtime.asientosDisponibles === 0) return;
    this.bookingService.setActiveShowtime(showtime);
    this.router.navigate(['/reservas/asientos']);
  }

  /** Helpers para visualización de disponibilidad */
  availabilityLevel(seats: number): 'sold-out' | 'low' | 'medium' | 'ok' {
    if (seats === 0)   return 'sold-out';
    if (seats <= 10)   return 'low';
    if (seats <= 25)   return 'medium';
    return 'ok';
  }

  roomIcon(tipo: string): string {
    const icons: Record<string, string> = {
      IMAX:   '🎞️',
      VIP:    '👑',
      '3D':   '🥽',
      NORMAL: '🎬',
    };
    return icons[tipo] ?? '🎬';
  }

  /** Duración legible, e.g. "2h 46min" */
  formatDuration(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m > 0 ? m + 'min' : ''}`.trim() : `${m}min`;
  }

  /** Año de la fecha de estreno */
  releaseYear(dateStr: string): string {
    return dateStr ? dateStr.split('-')[0] : '';
  }
}
