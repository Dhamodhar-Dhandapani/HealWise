package org.example.healwise.Controlers;

import org.example.healwise.entity.BedAllotment;
import org.example.healwise.entity.BedCategory;
import org.example.healwise.entity.BedInventory;
import org.example.healwise.service.BedAllotmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class BedAllotmentController {
    private final BedAllotmentService service;

    public BedAllotmentController(BedAllotmentService service) {
        this.service = service;
    }

    @PostMapping("/{hospitalId}/beds/allot")
    public ResponseEntity<BedAllotment> allotBed(
            @PathVariable Long hospitalId,
            @RequestParam Long patientId,
            @RequestParam BedCategory category) {

        BedAllotment allotment = service.allotBed(hospitalId, patientId, category);
        return ResponseEntity.ok(allotment);
    }

    @PostMapping("/{hospitalId}/beds/discharge/{allotmentId}")
    public ResponseEntity<Void> dischargePatient(
            @PathVariable Long hospitalId,
            @PathVariable Long allotmentId) {

        service.dischargePatient(allotmentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{hospitalId}/beds/inventory")
    public ResponseEntity<List<BedInventory>> getBedInventory(@PathVariable Long hospitalId) {
        List<BedInventory> inventory = service.getBedInventoryByHospital(hospitalId);
        return ResponseEntity.ok(inventory);
    }

    @PostMapping("/{hospitalId}/beds/inventory")
    public ResponseEntity<BedInventory> setBedInventory(
            @PathVariable Long hospitalId,
            @RequestParam BedCategory category,
            @RequestParam int totalCount,
            @RequestParam int availableCount) {
        BedInventory inventory = service.saveBedInventory(hospitalId, category, totalCount, availableCount);
        return new ResponseEntity<>(inventory, HttpStatus.CREATED);
    }
}
