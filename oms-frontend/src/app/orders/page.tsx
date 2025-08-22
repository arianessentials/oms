"use client";
import TelegramIcon from "@mui/icons-material/Telegram";
import Button from "@mui/material/Button";
import { useOrders } from "../hooks/orderHooks/useOrder";
import OrdersTable from "./_partials/OrdersTable";

export default function Orders() {
  const orderState = useOrders();
  const telegramOrders = useOrders;
  return (
    <div>
      <OrdersTable
        loading={orderState.loading}
        error={orderState.error}
        rows={orderState.rows}
      />
      <Button fullWidth startIcon={<TelegramIcon />} onClick={telegramOrders}>
        SEND
      </Button>
    </div>
  );
}
