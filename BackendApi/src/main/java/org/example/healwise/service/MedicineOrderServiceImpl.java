package org.example.healwise.service;

import org.example.healwise.dto.MedicineOrderRequestDTO;
import org.example.healwise.dto.OrderItemDTO;
import org.example.healwise.entity.MedicineOrder;
import org.example.healwise.entity.OrderItem;
import org.example.healwise.entity.Patient;
import org.example.healwise.repository.MedicineOrderRepository;
import org.example.healwise.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineOrderServiceImpl {

    private final MedicineOrderRepository orderRepository;
    private final PatientRepository patientRepository;

    public MedicineOrderServiceImpl(MedicineOrderRepository orderRepository, PatientRepository patientRepository) {
        this.orderRepository = orderRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public MedicineOrder placeOrder(MedicineOrderRequestDTO dto) {
        // 1. Validate Prescription Requirement
        boolean needsPrescription = dto.getItems().stream().anyMatch(OrderItemDTO::isRequiresPrescription);

        if (needsPrescription && (dto.getPrescriptionUrl() == null || dto.getPrescriptionUrl().isBlank())) {
            throw new IllegalArgumentException("A valid prescription URL is required for these medicines.");
        }

        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + dto.getPatientId()));

        // 2. Build the Order
        MedicineOrder order = new MedicineOrder();
        order.setPatient(patient);
        order.setDeliveryAddress(dto.getDeliveryAddress());
        order.setPrescriptionUrl(dto.getPrescriptionUrl());
        order.setStatus("PLACED");
        order.setOrderDate(LocalDateTime.now());

        // 3. Map items and calculate total
        double total = 0.0;
        List<OrderItem> entityItems = dto.getItems().stream().map(itemDto -> {
            OrderItem item = new OrderItem();
            item.setMedicineName(itemDto.getMedicineName());
            item.setQuantity(itemDto.getQuantity());
            item.setPrice(itemDto.getPrice());
            item.setRequiresPrescription(itemDto.isRequiresPrescription());
            item.setOrder(order); // Map back to parent
            return item;
        }).collect(Collectors.toList());

        order.setItems(entityItems);
        order.setTotalAmount(entityItems.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum());

        return orderRepository.save(order);
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String newStatus) {
        MedicineOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        String current = order.getStatus();

        // State Machine Rules
        if (current.equals("PLACED") && !newStatus.equals("PROCESSING")) {
            throw new IllegalStateException("Order must be PROCESSING before " + newStatus);
        }
        if (current.equals("PROCESSING") && !newStatus.equals("OUT_FOR_DELIVERY")) {
            throw new IllegalStateException("Order must be OUT_FOR_DELIVERY before " + newStatus);
        }
        if (current.equals("OUT_FOR_DELIVERY") && !newStatus.equals("DELIVERED")) {
            throw new IllegalStateException("Status can only jump from OUT_FOR_DELIVERY to DELIVERED");
        }

        order.setStatus(newStatus);
        orderRepository.save(order);
    }

    public MedicineOrder getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
    }

    public List<MedicineOrder> getOrdersByPatientId(Long patientId) {
        return orderRepository.findByPatientId(patientId);
    }

    public List<MedicineOrder> getAllOrders() {
        return orderRepository.findAll();
    }
}
