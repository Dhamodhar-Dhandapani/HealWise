package org.example.healwise.service;

import org.example.healwise.dto.HospitalRequestDTO;
import org.example.healwise.dto.HospitalResponceDTO;
import org.example.healwise.entity.Hospital;
import org.example.healwise.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HospitalServiceImpl implements HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;


    @Override
    public HospitalResponceDTO createHospital(HospitalRequestDTO hospitalRequestDTO) {
        Hospital hospital = new Hospital();
        hospital.setName(hospitalRequestDTO.getName());
        hospital.setAddress(hospitalRequestDTO.getAddress());
        hospital.setAvailableBeds(hospitalRequestDTO.getAvailableBeds());
        hospital.setTotalBeds(hospitalRequestDTO.getTotalBeds());
        hospital.setContactNumber(hospitalRequestDTO.getContactNumber());
        hospital.setEmail(hospitalRequestDTO.getEmail());
        Hospital savedHospital = hospitalRepository.save(hospital);

        return mapToResponseDTO(savedHospital);

    }

    @Override
    public HospitalResponceDTO getHospitalById(Long id){
         Hospital hospital = hospitalRepository.findById(id).orElseThrow(()->
                new RuntimeException("No Data find in this ID"+id)
        );
         return mapToResponseDTO(hospital);
    }

    @Override
    public List<HospitalResponceDTO> getAllHospitals(){

        return hospitalRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public HospitalResponceDTO updateAvailableBeds(Long id, int availableBeds ){
        Hospital hospital = hospitalRepository.findById(id).orElseThrow(()-> new RuntimeException("hospital not found"));
        hospital.setAvailableBeds(availableBeds);
        hospitalRepository.save(hospital);
        return mapToResponseDTO(hospital);
    }

    @Override
    public void deleteHospital(Long id) {
        Hospital hospital = hospitalRepository.findById(id).orElseThrow(()-> new RuntimeException("hospital not found"));
        hospitalRepository.delete(hospital);
    }

    private HospitalResponceDTO mapToResponseDTO(Hospital hospital) {
        return new HospitalResponceDTO(
                hospital.getId(),
                hospital.getName(),
                hospital.getAddress(),
                hospital.getEmail(),
                hospital.getContactNumber(),
                hospital.getTotalBeds(),
                hospital.getAvailableBeds()
        );
    }
}
