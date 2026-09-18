package org.example.healwise.dto;

import lombok.*;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PatientRequestDTO {

    @NotBlank
    private String name;
    @Email(message = "Email must required")
    @NotBlank
    private String email;
    @NotBlank
    private String address;
    @NotBlank
    private String phone;
    @NotBlank
    private String gender;
    @NotBlank
    private String birthDate;
    @NotBlank
    private String emergencyContact;
    @NotBlank
    private String bloodGroup;
    private String alergies;
    private String chronicConditions;

}
