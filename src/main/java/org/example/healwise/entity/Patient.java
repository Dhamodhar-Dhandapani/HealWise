package org.example.healwise.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String address;
    @Column(nullable = false)
    private String phone;
    @Column(nullable = false)
    private String gender;
    @Column(nullable = false)
    private String birthDate;
    @Column(nullable = false)
    private String emergencyContact;
    @Column(nullable = false)
    private String bloodGroup;
    private String alergies;
    private String chronicConditions;

}
