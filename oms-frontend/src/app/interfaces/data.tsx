// Allowed order status values
export const ORDER_STATUSES = ['pending', 'packaging', 'delivering', 'complete', 'cancelled'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

// Single order row structure
export interface OrderRow {
    id: number;
    orderItems: OrderItem[];
    totalAmount: string;
    status: OrderStatus;
    address: string;
    phone: string;
    createdAt: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string[];
    createdAt: string;
}

export interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: Product;
}
