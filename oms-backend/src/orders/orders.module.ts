import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { OrderItem } from './order-item.entity';
import { Product } from 'src/products/products.entity';
import { ProductsService } from 'src/products/products.service';
import { TelegramService } from './telegram/telegram.sevice';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product])],
  controllers: [OrdersController],
  providers: [OrdersService, ProductsService, TelegramService]
})
export class OrdersModule { }
