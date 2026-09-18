package org.example.healwise.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MedicineOrderRequestDTO {
    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    private String prescriptionUrl;

    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemDTO> items;
}
