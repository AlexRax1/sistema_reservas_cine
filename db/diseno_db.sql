CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    rol VARCHAR(30) NOT NULL DEFAULT 'USER',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_usuario_rol CHECK (rol IN ('USER', 'ADMIN'))
);

CREATE TABLE usuarios_credenciales (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    proveedor VARCHAR(20) NOT NULL DEFAULT 'LOCAL',
    proveedor_id VARCHAR(255),
    password_hash VARCHAR(255),
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_credencial_proveedor CHECK (proveedor IN ('LOCAL', 'GOOGLE', 'APPLE'))
);

CREATE TABLE peliculas (
    id BIGSERIAL PRIMARY KEY,
    tmdb_id BIGINT UNIQUE NOT NULL,
    titulo VARCHAR(250) NOT NULL,
    titulo_original VARCHAR(250),
    descripcion TEXT,
    poster_url VARCHAR(500),
    backdrop_url VARCHAR(500),
    duracion_minutos INT,
    fecha_estreno DATE,
    clasificacion VARCHAR(30),
    estado VARCHAR(30) NOT NULL DEFAULT 'PROXIMAMENTE',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_pelicula_estado CHECK (estado IN ('EN_CARTELERA', 'PROXIMAMENTE', 'FINALIZADA')),
    CONSTRAINT chk_pelicula_duracion CHECK (duracion_minutos IS NULL OR duracion_minutos > 0)
);

CREATE TABLE salas (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    tipo VARCHAR(30) NOT NULL DEFAULT 'NORMAL',
    capacidad_total INT NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_sala_tipo CHECK (tipo IN ('NORMAL', 'VIP', 'IMAX', '3D')),
    CONSTRAINT chk_sala_capacidad CHECK (capacidad_total > 0)
);

CREATE TABLE asientos (
    id BIGSERIAL PRIMARY KEY,
    sala_id BIGINT NOT NULL REFERENCES salas(id) ON DELETE CASCADE,
    fila CHAR(1) NOT NULL,
    numero INT NOT NULL,
    posicion_x INT NOT NULL,
    posicion_y INT NOT NULL,
    tipo VARCHAR(30) NOT NULL DEFAULT 'NORMAL',
    activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT uq_asiento_sala UNIQUE (sala_id, fila, numero),
    CONSTRAINT chk_asiento_tipo CHECK (tipo IN ('NORMAL', 'VIP', 'DISCAPACITADO', 'PASILLO')),
    CONSTRAINT chk_asiento_numero CHECK (numero > 0)
);

CREATE TABLE funciones (
    id BIGSERIAL PRIMARY KEY,
    pelicula_id BIGINT NOT NULL REFERENCES peliculas(id),
    sala_id BIGINT NOT NULL REFERENCES salas(id),
    fecha_hora_inicio TIMESTAMP NOT NULL,
    fecha_hora_fin TIMESTAMP NOT NULL,
    precio_base DECIMAL(10,2) NOT NULL,
    asientos_disponibles INT NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_funcion_horario CHECK (fecha_hora_fin > fecha_hora_inicio),
    CONSTRAINT chk_funcion_precio CHECK (precio_base >= 0),
    CONSTRAINT chk_funcion_asientos CHECK (asientos_disponibles >= 0)
);

CREATE TABLE reservas (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    funcion_id BIGINT NOT NULL REFERENCES funciones(id),
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    monto_total DECIMAL(10,2) NOT NULL,
    fecha_expiracion TIMESTAMP,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_reserva_estado CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'EXPIRADA')),
    CONSTRAINT chk_reserva_monto CHECK (monto_total >= 0)
);

CREATE TABLE reserva_asientos (
    id BIGSERIAL PRIMARY KEY,
    reserva_id BIGINT NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    asiento_id BIGINT NOT NULL REFERENCES asientos(id),
    tipo_ticket VARCHAR(30) NOT NULL DEFAULT 'ADULTO',
    precio DECIMAL(10,2) NOT NULL,

    CONSTRAINT uq_reserva_asiento UNIQUE (reserva_id, asiento_id),
    CONSTRAINT chk_reserva_asiento_tipo CHECK (tipo_ticket IN ('ADULTO', 'NINO', 'TERCERA_EDAD')),
    CONSTRAINT chk_reserva_asiento_precio CHECK (precio >= 0)
);

CREATE TABLE pagos (
    id BIGSERIAL PRIMARY KEY,
    reserva_id BIGINT NOT NULL REFERENCES reservas(id),
    proveedor VARCHAR(30) NOT NULL DEFAULT 'STRIPE',
    transaccion_externa_id VARCHAR(255),
    idempotency_key VARCHAR(255) UNIQUE,
    monto DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) NOT NULL DEFAULT 'USD',
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    fecha_pago TIMESTAMP,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_pago_proveedor CHECK (proveedor IN ('STRIPE', 'PAYPAL')),
    CONSTRAINT chk_pago_estado CHECK (estado IN ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'REEMBOLSADO')),
    CONSTRAINT chk_pago_monto CHECK (monto >= 0)
);


CREATE INDEX idx_funciones_pelicula ON funciones(pelicula_id);
CREATE INDEX idx_funciones_sala ON funciones(sala_id);
CREATE INDEX idx_funciones_fecha ON funciones(fecha_hora_inicio);

CREATE INDEX idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX idx_reservas_funcion ON reservas(funcion_id);

CREATE INDEX idx_reserva_asientos_reserva ON reserva_asientos(reserva_id);
CREATE INDEX idx_reserva_asientos_asiento ON reserva_asientos(asiento_id);

CREATE INDEX idx_pagos_reserva ON pagos(reserva_id);


CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_usuarios BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_fecha_actualizacion();
CREATE TRIGGER trg_update_usuarios_credenciales BEFORE UPDATE ON usuarios_credenciales FOR EACH ROW EXECUTE FUNCTION update_fecha_actualizacion();
CREATE TRIGGER trg_update_peliculas BEFORE UPDATE ON peliculas FOR EACH ROW EXECUTE FUNCTION update_fecha_actualizacion();
CREATE TRIGGER trg_update_salas BEFORE UPDATE ON salas FOR EACH ROW EXECUTE FUNCTION update_fecha_actualizacion();



