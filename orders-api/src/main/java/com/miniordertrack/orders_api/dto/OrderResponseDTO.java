package com.miniordertrack.orders_api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.miniordertrack.orders_api.domain.Order;

import java.time.LocalDateTime;
import java.util.UUID;

public class OrderResponseDTO {

    private UUID id;
    @JsonProperty("clientName")
    private String customerName;
    private String deliveryAddress;
    private String items;
    private String status;
    private LocalDateTime createdAt;

    public OrderResponseDTO() {
    }

    public OrderResponseDTO(Order order) {
        this.id = order.getId();
        this.customerName = order.getCustomerName();
        this.deliveryAddress = order.getDeliveryAddress();
        this.items = order.getItems();
        this.status = order.getStatus().name();
        this.createdAt = order.getCreatedAt();
    }

    public UUID getId() {
        return id;
    }

    public String getClientName() {
        return customerName;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public String getItems() {
        return items;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
