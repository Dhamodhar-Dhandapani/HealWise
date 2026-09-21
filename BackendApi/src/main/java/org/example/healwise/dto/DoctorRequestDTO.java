package org.example.healwise.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorRequestDTO {

    @NotBlank(message = "Name Required")
    private String name;

    @NotBlank(message = "Qualification need to be Filled")
    private String qualification;

    @NotBlank(message = "Specilisation Required")
    private String specialization;

    @NotNull(message = "Fill the Fee Details")
    private Double fee;

    @NotNull(message = "Need to Provide Hospital ID")
    private Long hospitalId;

}
