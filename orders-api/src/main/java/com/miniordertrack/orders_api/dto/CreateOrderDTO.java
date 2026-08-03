package com.miniordertrack.orders_api.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class CreateOrderDTO {
    @NotBlank(message = "O nome do cliente é obrigatório")
    @JsonAlias("clientName")
    private String customerName;

    @NotBlank(message = "O endereço de entrega é obrigatório")
    private String deliveryAddress;

    @NotEmpty(message = "Os itens do pedido são obrigatórios")
    private List<@NotBlank(message = "O nome do item não pode ser vazio") String> items;

    public CreateOrderDTO() {
    }

    public CreateOrderDTO(String customerName, String deliveryAddress, List<String> items) {
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

    public List<String> getItems() {
        return items;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }
}