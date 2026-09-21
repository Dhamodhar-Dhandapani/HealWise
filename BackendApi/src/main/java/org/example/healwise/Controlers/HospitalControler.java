package org.example.healwise.Controlers;


import org.example.healwise.dto.HospitalRequestDTO;
import org.example.healwise.dto.HospitalResponceDTO;
import org.example.healwise.service.HospitalServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalControler {

    private final HospitalServiceImpl hospitalService;


    public HospitalControler(HospitalServiceImpl hospitalService) {
        this.hospitalService = hospitalService;
    }

    @PostMapping
    public ResponseEntity<HospitalResponceDTO> createHospital(@RequestBody HospitalRequestDTO hospitalRequestDTO) {
        HospitalResponceDTO hosp = hospitalService.createHospital(hospitalRequestDTO);
        return new ResponseEntity<>(hosp, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<HospitalResponceDTO>> getAllHospitals() {
        return new ResponseEntity<>(hospitalService.getAllHospitals(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalResponceDTO> getHospitalById(@PathVariable Long id) {
        HospitalResponceDTO hosp = hospitalService.getHospitalById(id);
        return new ResponseEntity<>(hosp, HttpStatus.OK);
    }

    @PatchMapping("/{id}/beds")
    public ResponseEntity<HospitalResponceDTO> updateHospital(@PathVariable Long id, @RequestParam int beds) {
        HospitalResponceDTO hosp = hospitalService.updateAvailableBeds(id, beds);
        return new ResponseEntity<>(hosp, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public void deleteHospital(@PathVariable Long id) {
        hospitalService.deleteHospital(id);
    }

}
