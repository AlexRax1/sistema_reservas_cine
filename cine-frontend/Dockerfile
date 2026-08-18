# Dockerfile para producción / despliegue en la nube (Azure App Service, Container Apps, etc.)

# Etapa 1: Build de la SPA con Node.js
FROM node:22-alpine AS build
WORKDIR /app

# Copiar manifiestos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm y dependencias
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Compilar para producción (reemplaza environment.ts por environment.prod.ts)
RUN pnpm run build

# Etapa 2: Servidor Web Nginx ligero para servir los estáticos
FROM nginx:alpine AS runner

# Copiar archivos compilados
COPY --from=build /app/dist/cine-frontend/browser /usr/share/nginx/html

# Copiar configuración custom de Nginx para manejar rutas Angular (HTML5 History API)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
