import { Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { Order } from '../orders.entity';

@Injectable()
export class TelegramService {
    private bot: Bot;
    private chatId: string;

    constructor() {
        const BOT_TOKEN = process.env.BOT_TOKEN;
        const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID;

        if (!BOT_TOKEN) throw new Error("BOT_TOKEN missing!");
        if (!GROUP_CHAT_ID) throw new Error("GROUP_CHAT_ID missing!");

        this.bot = new Bot(BOT_TOKEN);
        this.chatId = GROUP_CHAT_ID;
    }

    async sendMessage(message: string) {
        await this.bot.api.sendMessage(this.chatId, message);
    }

    async notifyStatusChange(order: Order) {
        const message = `
Order #${order.id} status updated!
Status: ${order.status}
Total: $${order.totalAmount}
Address: ${order.address}
Phone: ${order.phone}
Created: ${order.createdAt.toLocaleString()}
        `;
        // Call the local sendMessage method
        await this.sendMessage(message);
    }
}
