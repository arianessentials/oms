import { Controller, Get, Param, Delete, Post, Body, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './orders.entity';

export class UpdateStatusDto {
    status: OrderStatus;
}


export class CreateOrderDto {
    address: string;
    phone: string;
    orderItems: { productId: number; quantity: number }[];
}

@Controller('/orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    // GET /orders
    @Get()
    findAll(): Promise<Order[]> {
        return this.ordersService.findAll();
    }

    // GET /orders/:id
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Order | null> {
        return this.ordersService.findOne((id));
    }

    @Post()
    async create(@Body() dto: CreateOrderDto) {
        try {
            return await this.ordersService.create(dto);
        } catch (err) {
            console.error('Error creating order:', err.message);
            throw new Error('Failed to create order: ' + err.message);
        }
    }

    @Put(':id')
    async updateStatus(
        @Param('id') id: number,
        @Body() dto: UpdateStatusDto
    ) {
        await this.ordersService.updateStatus(id, dto.status);
        return { message: `Order ${id} status updated to ${dto.status}` };
    }


    // DELETE /orders/:id
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.ordersService.delete(Number(id));
    }
}
