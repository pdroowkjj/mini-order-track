package com.miniordertrack.orders_api.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateOrderDTO {
    @NotBlank(message = "O nome do cliente é obrigatório")
    private String customerName;

    @NotBlank(message = "O endereço de entrega é obrigatório")
    private String deliveryAddress;

    @NotBlank(message = "Os itens do pedido são obrigatórios")
    private String items;

    public CreateOrderDTO() {
    }

    public CreateOrderDTO(String customerName, String deliveryAddress, String items) {
        this.customerName = customerName;
        this.deliveryAddress = deliveryAddress;
        this.items = items;
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
}