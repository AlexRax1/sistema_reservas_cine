import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../../core/models/movie.model';
import { MovieService } from '../../../../core/services/movie.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movie-list.component.html'
})
export class MovieListComponent implements OnInit {
  featuredMovie?: Movie;
  moviesEnCartelera: Movie[] = [];
  filteredMovies: Movie[] = [];

  searchTerm = '';
  selectedGenre = 'Todos';

  genres = ['Todos', 'Acción', 'Ciencia Ficción', 'Animación', 'Drama', 'Terror', 'Historia', 'Suspenso'];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getFeaturedMovie().subscribe(m => (this.featuredMovie = m));
    this.movieService.getMoviesEnCartelera().subscribe(list => {
      this.moviesEnCartelera = list;
      this.applyFilters();
    });
  }

  selectGenre(genre: string): void {
    this.selectedGenre = genre;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  applyFilters(): void {
    let list = [...this.moviesEnCartelera];

    if (this.selectedGenre !== 'Todos') {
      list = list.filter(m => m.generos?.includes(this.selectedGenre));
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(
        m =>
          m.titulo.toLowerCase().includes(term) ||
          m.descripcion.toLowerCase().includes(term) ||
          m.director?.toLowerCase().includes(term)
      );
    }

    this.filteredMovies = list;
  }
}
