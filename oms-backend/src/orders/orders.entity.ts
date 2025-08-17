import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
    PENDING = 'pending',
    PACKAGING = 'packaging',
    DELIVERING = 'delivering',
    COMPLETE = 'complete',
    CANCELLED = 'cancelled',
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    orderItems: OrderItem[];


    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING, })
    status: OrderStatus;

    @CreateDateColumn()
    createdAt: Date;

}