package org.example.healwise.service;

import jakarta.transaction.Transactional;
import org.example.healwise.dto.DoctorRequestDTO;
import org.example.healwise.dto.DoctorSlotRequestDTO;
import org.example.healwise.entity.Doctor;
import org.example.healwise.entity.DoctorSlot;
import org.example.healwise.entity.Hospital;
import org.example.healwise.repository.DoctorRepository;
import org.example.healwise.repository.DoctorSlotRepository;
import org.example.healwise.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorSlotRepository doctorSlotRepository;

    @Autowired
    private HospitalRepository hospitalRepository;


    public Doctor registerDoctor(DoctorRequestDTO dto) {
        Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        Doctor doctor = new Doctor();
        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setQualification(dto.getQualification());
        doctor.setFee(dto.getFee());
        doctor.setHospital(hospital);

        return doctorRepository.save(doctor);
    }


    public List<Doctor> getDoctorsByHospital(Long hospitalId) {
        return doctorRepository.findByHospitalId(hospitalId);
    }

    @Transactional
    public DoctorSlot addDoctorSlot(Long doctorId, DoctorSlotRequestDTO dto) {
        // 1. Validate chronological order
        if (!dto.getStartTime().isBefore(dto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be strictly before End time");
        }

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 2. Prevent overlapping schedules
        boolean isOverlapping = doctorSlotRepository.existsOverlappingSlot(
                doctorId, dto.getDate(), dto.getStartTime(), dto.getEndTime());

        if (isOverlapping) {
            throw new IllegalStateException("The requested time slot overlaps with an existing schedule.");
        }

        // 3. Create and save the new slot
        DoctorSlot slot = new DoctorSlot();
        slot.setDoctor(doctor);
        slot.setDate(dto.getDate());
        slot.setStartTime(dto.getStartTime());
        slot.setEndTime(dto.getEndTime());
        slot.setBooked(false); // Default to available

        return doctorSlotRepository.save(slot);
    }

    public List<DoctorSlot> getAvailableSlots(Long doctorId, LocalDate date) {
        return doctorSlotRepository.findByDoctorIdAndDateAndIsBookedFalse(doctorId, date);
    }


}
