package com.cinema.backend.pagos.internal.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PagoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long reservaId;
    private String proveedor;
    private String transaccionExternaId;
    private String idempotencyKey;
    private BigDecimal monto;
    private String moneda;
    private String estado;
    private LocalDateTime fechaPago;
    private LocalDateTime fechaCreacion;
}
