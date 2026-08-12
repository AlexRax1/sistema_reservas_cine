package com.cinema.backend.instalaciones.internal.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "salas")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SalaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String tipo;
    private Integer capacidadTotal;
    private Boolean activa;

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    @OneToMany(mappedBy = "sala", fetch = FetchType.LAZY)
    private List<AsientoEntity>  asientos;
}
