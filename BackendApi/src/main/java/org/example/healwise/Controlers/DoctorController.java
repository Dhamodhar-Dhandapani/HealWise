package org.example.healwise.Controlers;

import jakarta.validation.Valid;
import org.example.healwise.dto.DoctorRequestDTO;
import org.example.healwise.dto.DoctorSlotRequestDTO;
import org.example.healwise.entity.Doctor;
import org.example.healwise.entity.DoctorSlot;
import org.example.healwise.service.DoctorService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // 1. Register a new Doctor Profile
    @PostMapping
    public ResponseEntity<Doctor> registerDoctor(@Valid @RequestBody DoctorRequestDTO requestDTO) {
        Doctor savedDoctor = doctorService.registerDoctor(requestDTO);
        return new ResponseEntity<>(savedDoctor, HttpStatus.CREATED);
    }

    // 2. Get all Doctors for a Specific Hospital
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Doctor>> getDoctorsByHospital(@PathVariable Long hospitalId) {
        List<Doctor> doctors = doctorService.getDoctorsByHospital(hospitalId);
        return ResponseEntity.ok(doctors);
    }

    // 2.5 Get all Doctors
    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // 3. Add a new Consultation Time Slot
    @PostMapping("/{id}/slots")
    public ResponseEntity<DoctorSlot> addDoctorSlot(
            @PathVariable("id") Long doctorId,
            @Valid @RequestBody DoctorSlotRequestDTO slotRequestDTO) {
        DoctorSlot createdSlot = doctorService.addDoctorSlot(doctorId, slotRequestDTO);
        return new ResponseEntity<>(createdSlot, HttpStatus.CREATED);
    }

    // 4. Retrieve Available Time Slots for a Specific Date
    @GetMapping("/{id}/availability")
    public ResponseEntity<List<DoctorSlot>> getAvailableSlots(
            @PathVariable("id") Long doctorId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<DoctorSlot> availableSlots = doctorService.getAvailableSlots(doctorId, date);
        return ResponseEntity.ok(availableSlots);
    }

}
