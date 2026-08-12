package com.cinema.backend.users.internal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios_credenciales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CredencialEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private UsuarioEntity usuario;

    private String proveedor;
    private String proveedorId;
    private String passwordHash;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

}
