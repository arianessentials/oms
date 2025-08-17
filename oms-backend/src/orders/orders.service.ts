import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './orders.entity';
import { OrderItem } from './order-item.entity';
import { Product } from 'src/products/products.entity';

export class CreateOrderDto {
    orderItems: { productId: number; quantity: number }[];
    address: string;
    phone: string;
}

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(OrderItem)
        private orderItemsRepository: Repository<OrderItem>,
    ) { }

    findAll(): Promise<Order[]> {
        return this.ordersRepository.find({ relations: ['orderItems', 'orderItems.product'] });
    }

    findOne(id: number): Promise<Order | null> {
        if (!id) {
            throw new Error('Missing id');
        }
        return this.ordersRepository.findOne({
            where: { id },
            relations: ['orderItems', 'orderItems.product'],
        });
    }

    async create(dto: CreateOrderDto): Promise<Order> {
        if (!dto.orderItems?.length) throw new Error('Missing order items');
        if (!dto.address) throw new Error('Missing address');
        if (!dto.phone) throw new Error('Missing phone');

        const orderItems = await Promise.all(
            dto.orderItems.map(async (item) => {
                const product = await this.productsRepository.findOne({ where: { id: item.productId } });
                if (!product) throw new Error(`Product ${item.productId} not found`);

                return this.orderItemsRepository.create({
                    product,
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price,
                    totalAmount: product.price * item.quantity,
                });
            })
        );

        // ✅ Use item.totalAmount instead of order.totalAmount
        const totalAmount = orderItems.reduce((sum, item) => sum + item.totalAmount, 0);

        const order = this.ordersRepository.create({
            address: dto.address,
            phone: dto.phone,
            orderItems,
            totalAmount,
        });

        return this.ordersRepository.save(order);
    }

    async updateStatus(id: number, status: OrderStatus): Promise<void> {
        const result = await this.ordersRepository.update(id, { status });

        if (result.affected === 0) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
    }


    async delete(id: number): Promise<void> {
        if (!id) {
            throw new Error('Missing id');
        }
        await this.ordersRepository.delete(id);
    }
}
