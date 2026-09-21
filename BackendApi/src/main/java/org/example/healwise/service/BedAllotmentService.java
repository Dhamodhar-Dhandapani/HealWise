package org.example.healwise.service;

import org.example.healwise.entity.*;
import org.example.healwise.repository.BedAllotmentRepository;
import org.example.healwise.repository.BedInventoryRepository;
import org.example.healwise.repository.HospitalRepository;
import org.example.healwise.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BedAllotmentService {
    private final BedInventoryRepository inventoryRepository;
    private final BedAllotmentRepository allotmentRepository;
    private final HospitalRepository hospitalRepository;
    private final PatientRepository patientRepository;

    public BedAllotmentService(BedInventoryRepository inventoryRepository,
                               BedAllotmentRepository allotmentRepository,
                               HospitalRepository hospitalRepository,
                               PatientRepository patientRepository) {
        this.inventoryRepository = inventoryRepository;
        this.allotmentRepository = allotmentRepository;
        this.hospitalRepository = hospitalRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public BedAllotment allotBed(Long hospitalId, Long patientId, BedCategory category) {
        // 1. Atomically decrement the specific bed category
        int updatedRows = inventoryRepository.decrementAvailableBeds(hospitalId, category);

        if (updatedRows == 0) {
            throw new IllegalStateException("No available beds in the " + category + " category.");
        }

        // 2. Decrement the global hospital bed count
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found with id: " + hospitalId));
        if (hospital.getAvailableBeds() != null && hospital.getAvailableBeds() > 0) {
            hospital.setAvailableBeds(hospital.getAvailableBeds() - 1);
            hospitalRepository.save(hospital);
        }

        // 3. Generate the patient tracking record
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));

        BedAllotment allotment = new BedAllotment();
        allotment.setHospital(hospital);
        allotment.setPatient(patient);
        allotment.setCategory(category);
        allotment.setAllottedAt(LocalDateTime.now());
        allotment.setStatus("ACTIVE");

        return allotmentRepository.save(allotment);
    }

    @Transactional
    public void dischargePatient(Long allotmentId) {
        BedAllotment allotment = allotmentRepository.findById(allotmentId)
                .orElseThrow(() -> new RuntimeException("Allotment not found with id: " + allotmentId));

        if ("DISCHARGED".equalsIgnoreCase(allotment.getStatus())) {
            throw new IllegalStateException("Patient is already discharged.");
        }

        // 1. Update allotment record
        allotment.setStatus("DISCHARGED");
        allotment.setDischargedAt(LocalDateTime.now());
        allotmentRepository.save(allotment);

        // 2. Increment specific category inventory
        inventoryRepository.incrementAvailableBeds(
                allotment.getHospital().getId(),
                allotment.getCategory()
        );

        // 3. Increment global hospital count
        Hospital hospital = allotment.getHospital();
        if (hospital.getAvailableBeds() != null) {
            hospital.setAvailableBeds(hospital.getAvailableBeds() + 1);
            hospitalRepository.save(hospital);
        }
    }

    public List<BedInventory> getBedInventoryByHospital(Long hospitalId) {
        return inventoryRepository.findByHospitalId(hospitalId);
    }

    @Transactional
    public BedInventory saveBedInventory(Long hospitalId, BedCategory category, int totalCount, int availableCount) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found with id: " + hospitalId));

        // Find existing inventory for this hospital and category
        List<BedInventory> existing = inventoryRepository.findByHospitalId(hospitalId);
        BedInventory inventory = existing.stream()
                .filter(b -> b.getCategory() == category)
                .findFirst()
                .orElse(new BedInventory());

        inventory.setHospital(hospital);
        inventory.setCategory(category);
        inventory.setTotalCount(totalCount);
        inventory.setAvailableCount(availableCount);

        return inventoryRepository.save(inventory);
    }
}
