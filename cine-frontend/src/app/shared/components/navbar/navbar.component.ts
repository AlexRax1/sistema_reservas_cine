import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  readonly themeService = inject(ThemeService);

  /** Mock: simula si hay un usuario autenticado */
  isLoggedIn = false;
  userName = 'Alex';
  userInitial = 'A';

  mobileMenuOpen = false;
  scrolled = false;

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  /** Mock: simula login/logout */
  toggleAuth(): void {
    this.isLoggedIn = !this.isLoggedIn;
    this.closeMobileMenu();
  }
}