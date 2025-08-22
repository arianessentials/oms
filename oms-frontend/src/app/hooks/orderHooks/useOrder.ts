import { OrderItem, OrderRow, Product } from "@/app/interfaces/data";
import axios from "axios";
import { useEffect, useState } from "react";
import { OrderStatus } from "@/app/interfaces/data";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Initial form state
const INITIAL_FORM: Partial<OrderRow> = {
  orderItems: [],
  address: "",
  phone: "",
};

export function useOrders() {
  const [formData, setFormData] = useState<Partial<OrderRow>>({
    ...INITIAL_FORM,
  });
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  // Input change for normal text/number fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  // Textarea/multiline change
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  // Quantity input change
  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    orderItemId: number,
  ) => {
    const value = e.target.value;
    const quantity = value === "" ? 0 : parseInt(value, 10);

    setFormData((prev) => ({
      ...prev,
      orderItems: (prev.orderItems ?? []).map((item) =>
        item.id === orderItemId
          ? { ...item, quantity: isNaN(quantity) ? 0 : quantity }
          : item,
      ),
    }));
  };

  // Multi-select products
  const handleProductSelectChange = (event: any, products: Product[]) => {
    const selectedIds = event.target.value as number[];
    setSelectedProductIds(selectedIds);

    // Keep existing items still selected
    const updatedOrderItems = (formData.orderItems ?? []).filter((item) =>
      selectedIds.includes(item.product.id),
    );

    // Add new items
    const newItems = selectedIds
      .filter((id) => !updatedOrderItems.some((item) => item.product.id === id))
      .map((id) => {
        const product = products.find((p) => p.id === id);
        if (!product) return null;
        return {
          id: product.id,
          product,
          price: product.price,
          quantity: 0,
        } as OrderItem;
      })
      .filter(Boolean) as OrderItem[];

    setFormData((prev) => ({
      ...prev,
      orderItems: [...updatedOrderItems, ...newItems],
    }));
  };

  // Calculate total amount
  const calculateTotalAmount = (): number => {
    return (formData.orderItems ?? []).reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<OrderRow[]>(`${BACKEND_URL}/orders`);
      setRows(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArchivedOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<OrderRow[]>(
        `${BACKEND_URL}/orders/archived`,
      );
      setRows(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Create order
  const createOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        orderItems: (formData.orderItems ?? []).map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      await axios.post<OrderRow>(`${BACKEND_URL}/orders`, payload);

      // Reset form
      setFormData({ ...INITIAL_FORM });
      setSelectedProductIds([]);
    } catch (err) {
      if (axios.isAxiosError(err))
        setError(new Error(err.response?.data?.message || err.message));
      else setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (id: number, status: OrderStatus) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, status } : row)),
    );
    setLoading(true);
    setError(null);
    try {
      await axios.patch<OrderRow>(`${BACKEND_URL}/orders/${id}`, { status });
    } catch (err) {
      setError(err as Error);
      fetchOrders(); // revert if backend fails
    } finally {
      setLoading(false);
    }
  };

  const deleteOrderById = async (id: number) => {
      setLoading(true);
      setError(null);
      try {
          await axios.delete(`${BACKEND_URL}/orders/${id}`);
          setRows((prev) => prev.filter((order : OrderRow) => order.id !== id));
      } catch (err: any) {
          setError(new Error(err.response?.data?.message || err.message));
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    rows,
    loading,
    error,
    formData,
    selectedProductIds,
    handleChange,
    handleTextareaChange,
    handleQuantityChange,
    handleProductSelectChange,
    createOrder,
    deleteOrderById,
    updateOrderStatus,
    fetchOrders,
    fetchArchivedOrders,
    calculateTotalAmount,
  };
}
