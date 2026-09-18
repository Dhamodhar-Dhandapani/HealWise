package org.example.healwise.Controlers;

import jakarta.validation.Valid;
import org.example.healwise.dto.MedicineOrderRequestDTO;
import org.example.healwise.entity.MedicineOrder;
import org.example.healwise.service.MedicineOrderServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines/orders")
public class MedicineOrderController {

    private final MedicineOrderServiceImpl orderService;

    public MedicineOrderController(MedicineOrderServiceImpl orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<MedicineOrder> placeOrder(@Valid @RequestBody MedicineOrderRequestDTO requestDTO) {
        MedicineOrder created = orderService.placeOrder(requestDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MedicineOrder>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineOrder> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicineOrder>> getOrdersByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(orderService.getOrdersByPatientId(patientId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
