package org.example.healwise.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore // Prevents infinite recursion when serializing to JSON
    private MedicineOrder order;

    @Column(nullable = false)
    private String medicineName;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private boolean requiresPrescription;
}