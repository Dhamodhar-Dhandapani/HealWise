package org.example.healwise.dto;

import lombok.*;

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
