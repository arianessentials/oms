import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { OrdersController } from 'src/orders/orders.controller';
import { OrdersService } from 'src/orders/orders.service';
import { Order } from 'src/orders/orders.entity';
import { OrderItem } from 'src/orders/order-item.entity';
import { TelegramService } from 'src/orders/telegram/telegram.sevice';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Order, OrderItem])],
  providers: [ProductsService, OrdersService, TelegramService],
  controllers: [ProductsController, OrdersController]
})
export class ProductsModule { }
