package org.example.healwise.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "bed_allotments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BedAllotment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BedCategory category;

    @Column(nullable = false)
    private LocalDateTime allottedAt;

    private LocalDateTime dischargedAt;

    @Column(nullable = false)
    private String status; // "ACTIVE" or "DISCHARGED"
}