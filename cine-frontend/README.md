# 🎬 Sistema de Reservas de Cine — Frontend

> Frontend Angular del sistema completo de reservas de cine con soporte de bloqueo temporal vía Redis, diseño dark/light mode, y flujo de compra completo.

![Angular](https://img.shields.io/badge/Angular-19+-DD0031?style=flat&logo=angular)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfaces TypeScript (Movie, Seat, Booking, Payment…)
│   │   └── services/        # Servicios Angular (BookingService, MovieService, ThemeService)
│   ├── features/
│   │   ├── auth/
│   │   │   └── pages/
│   │   │       ├── login/   # login.component.ts + login.component.html
│   │   │       └── register/# register.component.ts + register.component.html
│   │   ├── booking/
│   │   │   └── pages/
│   │   │       ├── seat-selection/   # Mapa de asientos (VIP, bloqueados, ocupados)
│   │   │       ├── booking-summary/  # Resumen antes de pagar
│   │   │       ├── payment/          # Formulario de pago
│   │   │       └── confirmation/     # Ticket de confirmación con QR
│   │   │       └── my-bookings/      # Historial de compras
│   │   └── movies/
│   │       └── pages/
│   │           ├── movie-list/  # Cartelera con filtros de género y búsqueda
│   │           ├── movie-detail/# Detalle de película + selector de funciones
│   │           └── upcoming/    # Próximos estrenos
│   ├── shared/
│   │   └── components/      # Componentes compartidos globales
│   │       ├── navbar/      # <app-navbar> (Navegación + Toggle Dark/Light mode)
│   │       └── footer/      # <app-footer> (Pie de página institucional)
│   ├── app.component.html   # Estructura principal (<app-navbar> + <router-outlet> + <app-footer>)
│   ├── app.component.ts     # Componente raíz
│   ├── app.routes.ts        # Definición de rutas principales
│   └── app.config.ts        # Configuración global de la app (providers, router, HTTP)
└── styles.css               # Sistema de diseño global (variables CSS, componentes base)
```

> ℹ️ **Sobre los estilos:**
> Los componentes utilizan **Tailwind CSS** para maquetación e interactividad visual, y consumen las **variables CSS globales** definidas en `src/styles.css` (`var(--bg-base)`, `var(--text-primary)`, `var(--accent)`, etc.) para soportar la alternancia dinámica entre **Dark Mode** y **Light Mode**.

---

## 🚀 Instalación y desarrollo

### Requisitos
- Node.js ≥ 18
- pnpm (recomendado) o npm

### Instalar dependencias

```bash
pnpm install
# o
npm install
```

### Servidor de desarrollo

```bash
pnpm run start
# o
ng serve
```

Abre `http://localhost:4200` en el navegador. Se recarga automáticamente al modificar archivos.

### Build de producción

```bash
pnpm run build
```

Los artefactos se generan en `/dist`.

---

## 🎨 Sistema de diseño

El tema visual se controla mediante **variables CSS** definidas en `src/styles.css`:

| Variable | Uso |
|---|---|
| `--bg-base / --bg-surface / --bg-elevated` | Fondos en capas (Deep Navy en Dark / Slate Off-white en Light) |
| `--text-primary / --text-secondary / --text-muted` | Jerarquía de texto con alto contraste |
| `--accent / --accent-soft / --accent-muted / --accent-glow` | Color de acento (Indigo) |
| `--seat-vip-*` | Asientos VIP (dorado cálido con ícono ★) |
| `--seat-locked-*` | Asientos bloqueados temporalmente por Redis (naranja fuego con animación de pulso) |
| `--seat-occupied-*` | Asientos ocupados |
| `--seat-selected-*` | Asientos seleccionados por el usuario |

El tema se alterna con `ThemeService.toggle()` — cambia el atributo `data-theme` del elemento `<html>`.

---

## 🔒 Bloqueo temporal de asientos (Redis)

El frontend soporta el estado `LOCKED` en los asientos:

- Si **Redis está activo**, el backend puede devolver `status: "LOCKED"` para asientos reservados temporalmente por otro usuario (TTL ~5 min).
- Si **Redis no está disponible**, el backend simplemente no devuelve `LOCKED` y la app funciona normalmente — **el frontend no se rompe**.
- Los asientos `LOCKED` se muestran en **naranja fuego** con animación de pulso y no son seleccionables.

---

## 🔌 Conexión con el Backend

Por defecto apunta a `http://localhost:8080` (API Gateway). Modifica la URL base en los servicios:

```
src/app/core/services/movie.service.ts
src/app/core/services/booking.service.ts
```

---

## 📦 Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 19+ | Framework SPA |
| TypeScript | 5.x | Lenguaje principal |
| Tailwind CSS | 4.x | Utilidades CSS |
| RxJS | Incluido en Angular | Observables / HTTP |

---

## 🗺️ Rutas de la aplicación

| Ruta | Componente | Descripción |
|---|---|---|
| `/cartelera` | MovieListComponent | Lista de películas en cartelera |
| `/peliculas/:id` | MovieDetailComponent | Detalle + selector de funciones |
| `/proximos-estrenos` | UpcomingComponent | Próximos estrenos |
| `/booking/seats/:id` | SeatSelectionComponent | Mapa de asientos |
| `/booking/summary` | BookingSummaryComponent | Resumen de reserva |
| `/booking/payment` | PaymentComponent | Formulario de pago |
| `/booking/confirmation` | ConfirmationComponent | Confirmación + ticket QR |
| `/mis-reservas` | MyBookingsComponent | Historial de reservas |
| `/auth/login` | LoginComponent | Inicio de sesión |
| `/auth/register` | RegisterComponent | Registro de cuenta |
