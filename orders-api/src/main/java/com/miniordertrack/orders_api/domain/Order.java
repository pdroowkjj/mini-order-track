package com.miniordertrack.orders_api.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_orders")
public class Order {
    @Id
    @Column(columnDefinition = "VARCHAR(36)")
    private UUID id;

    // customerName, deliveryAddress, and items are intentionally denormalized in
    // this simplified project.
    // In a production system, Customer and Address would be
    // separate entities/tables, and items would likely reside in an OrderItem table
    // associated with a Product catalog.
    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String deliveryAddress;

    @Column(nullable = false)
    private String items;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    private LocalDateTime createdAt;

    public Order() {
    }

    public Order(String customerName, String deliveryAddress, String items) {
        this.id = UUID.randomUUID();
        this.customerName = customerName;
        this.deliveryAddress = deliveryAddress;
        this.items = items;
        this.status = OrderStatus.RECEBIDO;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getItems() {
        return items;
    }

    public void setItems(String items) {
        this.items = items;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}