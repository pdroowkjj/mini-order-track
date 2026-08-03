package com.miniordertrack.orders_api.dto;

import com.miniordertrack.orders_api.domain.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateOrderDTO {
    @NotNull(message = "O novo status é obrigatório")
    private OrderStatus status;

    public UpdateOrderDTO() {
    }

    public UpdateOrderDTO(OrderStatus status) {
        this.status = status;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
