import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cartelera',
    pathMatch: 'full'
  },
  {
    path: 'cartelera',
    loadComponent: () =>
      import('./features/movies/pages/movie-list/movie-list.component').then(
        m => m.MovieListComponent
      )
  },
  {
    path: 'proximos-estrenos',
    loadComponent: () =>
      import('./features/movies/pages/upcoming/upcoming.component').then(
        m => m.UpcomingComponent
      )
  },
  {
    path: 'peliculas/:id',
    loadComponent: () =>
      import('./features/movies/pages/movie-detail/movie-detail.component').then(
        m => m.MovieDetailComponent
      )
  },
  {
    path: 'reservas/asientos',
    loadComponent: () =>
      import('./features/booking/pages/seat-selection/seat-selection.component').then(
        m => m.SeatSelectionComponent
      )
  },
  {
    path: 'reservas/resumen',
    loadComponent: () =>
      import('./features/booking/pages/booking-summary/booking-summary.component').then(
        m => m.BookingSummaryComponent
      )
  },
  {
    path: 'reservas/pago',
    loadComponent: () =>
      import('./features/booking/pages/payment/payment.component').then(
        m => m.PaymentComponent
      )
  },
  {
    path: 'reservas/confirmacion',
    loadComponent: () =>
      import('./features/booking/pages/confirmation/confirmation.component').then(
        m => m.ConfirmationComponent
      )
  },
  {
    path: 'mis-reservas',
    loadComponent: () =>
      import('./features/booking/pages/my-bookings/my-bookings.component').then(
        m => m.MyBookingsComponent
      )
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        m => m.LoginComponent
      )
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.component').then(
        m => m.RegisterComponent
      )
  },
  {
    path: '**',
    redirectTo: 'cartelera'
  }
];
