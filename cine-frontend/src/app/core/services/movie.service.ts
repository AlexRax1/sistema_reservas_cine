import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Movie } from '../models/movie.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = `${environment.apiUrl}/api/peliculas`;

  private mockMovies: Movie[] = [
    {
      id: 1,
      tmdbId: 693134,
      titulo: 'Dune: Parte Dos',
      tituloOriginal: 'Dune: Part Two',
      descripcion: 'Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      duracionMinutos: 166,
      fechaEstreno: '2024-02-29',
      clasificacion: 'PG-13',
      estado: 'EN_CARTELERA',
      generos: ['Ciencia Ficción', 'Aventura', 'Acción'],
      director: 'Denis Villeneuve',
      reparto: ['Timothée Chalamet', 'Zendaya', 'Javier Bardem']
    },
    {
      id: 2,
      tmdbId: 872585,
      titulo: 'Oppenheimer',
      tituloOriginal: 'Oppenheimer',
      descripcion: 'La historia del físico estadounidense J. Robert Oppenheimer y su papel en el Proyecto Manhattan.',
      posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
      duracionMinutos: 180,
      fechaEstreno: '2023-07-20',
      clasificacion: 'R',
      estado: 'EN_CARTELERA',
      generos: ['Drama', 'Historia', 'Biografía'],
      director: 'Christopher Nolan',
      reparto: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon']
    },
    {
      id: 3,
      tmdbId: 569094,
      titulo: 'Spider-Man: Across the Spider-Verse',
      tituloOriginal: 'Spider-Man: Across the Spider-Verse',
      descripcion: 'Miles Morales es catapultado a través del Multiverso.',
      posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=1600&auto=format&fit=crop',
      duracionMinutos: 140,
      fechaEstreno: '2023-06-01',
      clasificacion: 'PG',
      estado: 'EN_CARTELERA',
      generos: ['Animación', 'Acción', 'Aventura'],
      director: 'Joaquim Dos Santos',
      reparto: ['Shameik Moore', 'Hailee Steinfeld']
    }
  ];

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl).pipe(
      catchError(() => of(this.mockMovies))
    );
  }

  getMoviesEnCartelera(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/cartelera`).pipe(
      catchError(() => of(this.mockMovies.filter(m => m.estado === 'EN_CARTELERA')))
    );
  }

  getMoviesProximamente(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/proximamente`).pipe(
      catchError(() => of(this.mockMovies.filter(m => m.estado === 'PROXIMAMENTE')))
    );
  }

  getMovieById(id: number): Observable<Movie | undefined> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(this.mockMovies.find(m => m.id === Number(id))))
    );
  }

  getFeaturedMovie(): Observable<Movie> {
    return of(this.mockMovies[0]);
  }
}
