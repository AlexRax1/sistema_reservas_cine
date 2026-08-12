package com.cinema.backend.catalogo.internal.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "peliculas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PeliculaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tmdb_id", unique = true, nullable = false)
    private Long tmdbId;
    private String titulo;
    private String tituloOriginal;
    private String descripcion;
    private String posterUrl;
    private String backdropUrl;
    private Integer duracionMinutos;
    private LocalDate fechaEstreno;
    private String clasificacion;
    private String estado;

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;


}
