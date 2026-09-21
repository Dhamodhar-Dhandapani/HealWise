package org.example.healwise.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bed_inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BedInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BedCategory category;

    @Column(nullable = false)
    private int totalCount;

    @Column(nullable = false)
    private int availableCount;
}