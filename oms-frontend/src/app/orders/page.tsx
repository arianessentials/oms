'use client';
import { useOrders } from "../hooks/orderHooks/useOrder";
import OrdersTable from "./_partials/OrdersTable";

export default function Orders() {
    const orderState = useOrders();

    return (
        <div>
            <OrdersTable
                loading={orderState.loading}
                error={orderState.error}
                rows={orderState.rows}
            />
        </div>
    );
}
