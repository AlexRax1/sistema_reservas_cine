export interface Movie {
  id: number;
  tmdbId: number;
  titulo: string;
  tituloOriginal?: string;
  descripcion: string;
  posterUrl: string;
  backdropUrl: string;
  duracionMinutos: number;
  fechaEstreno: string;
  clasificacion: string;
  estado: 'EN_CARTELERA' | 'PROXIMAMENTE' | 'FINALIZADA';
  generos?: string[];
  director?: string;
  reparto?: string[];
}
