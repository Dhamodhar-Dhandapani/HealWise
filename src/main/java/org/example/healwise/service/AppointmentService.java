package org.example.healwise.service;

import jakarta.transaction.Transactional;
import org.example.healwise.dto.AppointmentRequestDTO;
import org.example.healwise.entity.*;
import org.example.healwise.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorSlotRepository doctorSlotRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorSlotRepository doctorSlotRepository,
                              PatientRepository patientRepository,
                              DoctorRepository doctorRepository,
                              HospitalRepository hospitalRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorSlotRepository = doctorSlotRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
    }

    @Transactional
    public Appointment bookAppointment(AppointmentRequestDTO dto) {
        DoctorSlot slot = doctorSlotRepository.findById(dto.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found with id: " + dto.getSlotId()));

        if (slot.isBooked()) {
            throw new IllegalStateException("Slot is already booked");
        }

        // Lock the slot
        slot.setBooked(true);
        doctorSlotRepository.save(slot);

        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + dto.getPatientId()));
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + dto.getDoctorId()));
        Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
                .orElseThrow(() -> new RuntimeException("Hospital not found with id: " + dto.getHospitalId()));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setHospital(hospital);
        appointment.setSlot(slot);
        appointment.setAppointmentDate(slot.getDate());
        appointment.setAppointmentTime(slot.getStartTime());
        appointment.setStatus("CONFIRMED");
        appointment.setNotes(dto.getNotes());

        return appointmentRepository.save(appointment);
    }

    @Transactional
    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + appointmentId));

        appointment.setStatus("CANCELLED");

        // Revert the slot availability
        DoctorSlot slot = appointment.getSlot();
        if (slot != null) {
            slot.setBooked(false);
            doctorSlotRepository.save(slot);
        }

        appointmentRepository.save(appointment);
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctorAndDate(Long doctorId, LocalDate date) {
        return appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date);
    }
}
