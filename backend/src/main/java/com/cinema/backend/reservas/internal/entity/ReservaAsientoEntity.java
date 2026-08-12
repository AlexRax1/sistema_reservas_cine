package com.cinema.backend.reservas.internal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "reserva_asientos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservaAsientoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id")
    private ReservaEntity reserva;

    private Long asientoId;
    private String tipoTicket;
    private BigDecimal precio;



}
