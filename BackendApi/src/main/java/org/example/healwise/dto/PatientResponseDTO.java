package org.example.healwise.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PatientResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String address;
    private String phone;
    private String gender;
    private String birthDate;
    private String emergencyContact;
    private String bloodGroup;
    private String alergies;
    private String chronicConditions;
}
