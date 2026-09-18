package org.example.healwise.repository;

import org.example.healwise.entity.MedicineOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicineOrderRepository extends JpaRepository<MedicineOrder, Long> {
    List<MedicineOrder> findByPatientId(Long patientId);
}