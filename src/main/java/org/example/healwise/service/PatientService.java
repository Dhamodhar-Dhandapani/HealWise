package org.example.healwise.service;

import org.example.healwise.dto.PatientRequestDTO;
import org.example.healwise.dto.PatientResponseDTO;
import org.example.healwise.entity.Patient;
import org.example.healwise.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public PatientResponseDTO create(PatientRequestDTO patientRequestDTO) {
        Patient patient = new Patient();
        patient.setName(patientRequestDTO.getName());
        patient.setGender(patientRequestDTO.getGender());
        patient.setAddress(patientRequestDTO.getAddress());
        patient.setEmail(patientRequestDTO.getEmail());
        patient.setPhone(patientRequestDTO.getPhone());
        patient.setAlergies(patientRequestDTO.getAlergies());
        patient.setBirthDate(patientRequestDTO.getBirthDate());
        patient.setChronicConditions(patientRequestDTO.getChronicConditions());
        patient.setEmergencyContact(patientRequestDTO.getEmergencyContact());
        patient.setBloodGroup(patientRequestDTO.getBloodGroup());
        Patient saved = patientRepository.save(patient);

        return mapToResponseDTO(saved);
    }

    public PatientResponseDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient data not found with id: " + id));
        return mapToResponseDTO(patient);
    }

    public List<PatientResponseDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public PatientResponseDTO update(Long id, PatientRequestDTO patientRequestDTO) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient data not found with id: " + id));

        patient.setName(patientRequestDTO.getName());
        patient.setGender(patientRequestDTO.getGender());
        patient.setAddress(patientRequestDTO.getAddress());
        patient.setEmail(patientRequestDTO.getEmail());
        patient.setPhone(patientRequestDTO.getPhone());
        patient.setAlergies(patientRequestDTO.getAlergies());
        patient.setBirthDate(patientRequestDTO.getBirthDate());
        patient.setChronicConditions(patientRequestDTO.getChronicConditions());
        patient.setEmergencyContact(patientRequestDTO.getEmergencyContact());
        patient.setBloodGroup(patientRequestDTO.getBloodGroup());
        Patient saved = patientRepository.save(patient);

        return mapToResponseDTO(saved);
    }

    public void delete(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient data not found with id: " + id));
        patientRepository.delete(patient);
    }

    private PatientResponseDTO mapToResponseDTO(Patient patient) {
        return new PatientResponseDTO(
                patient.getId(),
                patient.getName(),
                patient.getEmail(),
                patient.getAddress(),
                patient.getPhone(),
                patient.getGender(),
                patient.getBirthDate(),
                patient.getBloodGroup(),
                patient.getEmergencyContact(),
                patient.getAlergies(),
                patient.getChronicConditions()
        );
    }
}
