package org.example.healwise.service;

import org.example.healwise.dto.HospitalRequestDTO;
import org.example.healwise.dto.HospitalResponceDTO;

import java.util.List;

public interface HospitalService {

    HospitalResponceDTO createHospital(HospitalRequestDTO hospitalRequestDTO);
    HospitalResponceDTO getHospitalById(Long id);
    List<HospitalResponceDTO> getAllHospitals();
    HospitalResponceDTO updateAvailableBeds(Long id, int availableBeds );
    void deleteHospital(Long id);
}
