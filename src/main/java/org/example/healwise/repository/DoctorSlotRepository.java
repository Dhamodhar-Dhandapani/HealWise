package org.example.healwise.repository;

import org.example.healwise.entity.DoctorSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface DoctorSlotRepository extends JpaRepository<DoctorSlot,Long> {
    List<DoctorSlot> findByDoctorIdAndDateAndIsBookedFalse(Long doctorId, LocalDate date);

    // Returns true if any slot on this date intersects with the requested start/end times
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END " +
            "FROM DoctorSlot s WHERE s.doctor.id = :doctorId " +
            "AND s.date = :date " +
            "AND s.startTime < :endTime " +
            "AND s.endTime > :startTime")
    boolean existsOverlappingSlot(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);
}
