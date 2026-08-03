package com.miniordertrack.orders_api.controller;

import com.miniordertrack.orders_api.domain.Order;
import com.miniordertrack.orders_api.dto.CreateOrderDTO;
import com.miniordertrack.orders_api.dto.OrderResponseDTO;
import com.miniordertrack.orders_api.dto.UpdateOrderDTO;
import com.miniordertrack.orders_api.repository.OrderRepository;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orderRepository;

    // dep injection through constructor
    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody CreateOrderDTO dto) {
        String items = dto.getItems().stream().collect(Collectors.joining(", "));
        Order newOrder = new Order(dto.getCustomerName(), dto.getDeliveryAddress(), items);
        Order savedOrder = orderRepository.save(newOrder);

        return ResponseEntity.status(HttpStatus.CREATED).body(new OrderResponseDTO(savedOrder));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        List<OrderResponseDTO> orders = orderRepository.findAll()
                .stream()
                .map(OrderResponseDTO::new)
                .toList();

        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable UUID id) {
        return orderRepository.findById(id)
                .map(order -> ResponseEntity.ok(new OrderResponseDTO(order)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOrderDTO dto) {

        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(dto.getStatus());
                    Order updateOrder = orderRepository.save(order);
                    return ResponseEntity.ok(new OrderResponseDTO(updateOrder));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Void> handleInvalidId() {
        return ResponseEntity.notFound().build();
    }
}
