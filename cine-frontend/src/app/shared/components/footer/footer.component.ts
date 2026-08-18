import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styles: [`
    .footer-link {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.15s;
    }
    .footer-link:hover {
      color: var(--accent-soft);
    }
  `]
})
export class FooterComponent {}
