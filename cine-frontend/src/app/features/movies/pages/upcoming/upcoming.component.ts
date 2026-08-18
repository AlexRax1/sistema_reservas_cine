import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../../core/services/movie.service';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-upcoming',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upcoming.component.html'
})
export class UpcomingComponent {
  movies: Movie[] = [];

  constructor(private movieService: MovieService) {
    this.movieService.getMoviesProximamente().subscribe(m => (this.movies = m));
  }
}
