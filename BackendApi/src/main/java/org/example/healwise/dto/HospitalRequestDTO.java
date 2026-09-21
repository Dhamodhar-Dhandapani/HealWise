package org.example.healwise.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HospitalRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Contact Number Required")
    private String contactNumber;

    @NotNull
    @Min(0)
    private Integer totalBeds;

    @NotNull
    @Min(0)
    private Integer availableBeds;

}
