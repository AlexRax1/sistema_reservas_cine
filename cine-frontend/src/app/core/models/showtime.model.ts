import { Movie } from './movie.model';
import { Room } from './room.model';

export interface Showtime {
  id: number;
  peliculaId: number;
  salaId: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  precioBase: number;
  asientosDisponibles: number;
  activa: boolean;

  // Relaciones pobladas en el Frontend / Mock
  pelicula?: Movie;
  sala?: Room;
}
