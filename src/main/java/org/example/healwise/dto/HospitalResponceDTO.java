package org.example.healwise.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HospitalResponceDTO {

    private Long HospitalId;
    private String Name;
    private String Address;
    private String Email;
    private String ContactNumber;
    private Integer TotalBeds;
    private Integer AvailableBeds;


}
