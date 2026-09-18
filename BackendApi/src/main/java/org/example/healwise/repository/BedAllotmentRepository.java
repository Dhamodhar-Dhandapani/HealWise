package org.example.healwise.repository;

import org.example.healwise.entity.BedAllotment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface BedAllotmentRepository extends JpaRepository<BedAllotment, Long> {
}
