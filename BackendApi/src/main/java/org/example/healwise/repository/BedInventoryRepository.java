package org.example.healwise.repository;

import org.example.healwise.entity.BedCategory;
import org.example.healwise.entity.BedInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BedInventoryRepository extends JpaRepository<BedInventory, Long> {
    List<BedInventory> findByHospitalId(Long hospitalId);

    // Atomically decrement a bed if availableCount is > 0
    @Modifying
    @Query("UPDATE BedInventory b SET b.availableCount = b.availableCount - 1 " +
            "WHERE b.hospital.id = :hospitalId AND b.category = :category AND b.availableCount > 0")
    int decrementAvailableBeds(@Param("hospitalId") Long hospitalId,
                               @Param("category") BedCategory category);

    // Atomically increment a bed upon discharge
    @Modifying
    @Query("UPDATE BedInventory b SET b.availableCount = b.availableCount + 1 " +
            "WHERE b.hospital.id = :hospitalId AND b.category = :category")
    int incrementAvailableBeds(@Param("hospitalId") Long hospitalId,
                               @Param("category") BedCategory category);
}