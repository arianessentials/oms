import { Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import fetch, { RequestInit } from 'node-fetch';
import { Agent } from 'https';
import { Order, OrderStatus } from '../orders.entity';

@Injectable()
export class TelegramService {
    private bot: Bot;
    private chatId: string;

    constructor() {
        const BOT_TOKEN = process.env.BOT_TOKEN;
        const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID;

        if (!BOT_TOKEN) throw new Error("BOT_TOKEN missing!");
        if (!GROUP_CHAT_ID) throw new Error("GROUP_CHAT_ID missing!");

        const agent = new Agent({ family: 4 }); // force IPv4

        this.bot = new Bot(BOT_TOKEN, {
            client: {
                fetch: (url: string, options?: RequestInit) => fetch(url, { ...options, agent })
            }
        });

        this.chatId = GROUP_CHAT_ID;
    }

    async sendMessage(message: string) {
        try {
            await this.bot.api.sendMessage(this.chatId, message, { parse_mode: "HTML" });
        } catch (err) {
            console.error("Telegram sendMessage failed:", err.message);
        }


    } private getStatusLabel(status: OrderStatus): string {
        switch (status) {
            case OrderStatus.PENDING: return "🟡 Pending";
            case OrderStatus.PACKAGING: return "📦 Packaging";
            case OrderStatus.DELIVERING: return "🚚 Delivering";
            case OrderStatus.COMPLETE: return "✅ Complete";
            case OrderStatus.CANCELLED: return "❌ Cancelled";
            default: return status;
        }
    }

    async notifyStatusChange(order: Order) {
        const message = `
<b>Order #${order.id} status updated!</b>
<b>Status:</b> ${this.getStatusLabel(order.status)}
<b>Total:</b> $${order.totalAmount}
<b>Address:</b> ${order.address}
<b>Phone:</b> ${order.phone}
<b>Created:</b> ${order.createdAt.toLocaleString()}
        `;
        await this.sendMessage(message);
    }
    async notifyNewOrder(order: Order) {
        const itemsText = order.orderItems
            .map(item => `${item.product.name} x ${item.quantity} = $${item.totalAmount}`)
            .join('\n');

        const message = `
<b>New Order Received!</b>
<b>Address:</b> ${order.address}
<b>Phone:</b> ${order.phone}
<b>Items:</b>
${itemsText}
<b>Total:</b> $${order.totalAmount}
    `;

        await this.sendMessage(message);
    }

}
