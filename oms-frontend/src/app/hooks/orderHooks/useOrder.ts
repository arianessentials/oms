import { OrderItem, OrderRow, Product } from "@/app/interfaces/data";
import axios from "axios";
import { useEffect, useState } from "react";
import { OrderStatus } from "@/app/interfaces/data";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useOrders() {
    const [formData, setFormData] = useState<Partial<OrderRow>>({
        orderItems: [],
        address: '',
        phone: '',
    });

    const [rows, setRows] = useState<OrderRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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
            const response = await axios.get<OrderRow[]>(`${BACKEND_URL}/orders/archived`);
            setRows(response.data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };


    const handleProductSelectChange = (event: any, products: Product[]) => {
        const selectedIds = event.target.value as number[];

        // Filter out items that are no longer selected
        const updatedOrderItems = (formData.orderItems ?? []).filter(item =>
            selectedIds.includes(item.product.id)
        );

        // Add new items with a default quantity of 1
        const newItems = selectedIds
            .filter(id => !updatedOrderItems.some(item => item.product.id === id))
            .map(id => {
                const product = products.find(p => p.id === id);
                if (!product) return null;

                return {
                    id: product.id, // Temporary ID for new items
                    product: product,
                    price: product.price,
                    quantity: 0
                } as OrderItem;
            })
            .filter(Boolean) as OrderItem[];

        // Update form data with new order items
        setFormData(prev => ({
            ...prev,
            orderItems: [...updatedOrderItems, ...newItems],
        }));
    };

    const createOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                ...formData,
                orderItems: (formData.orderItems ?? []).map(item => ({
                    productId: (item.product?.id),
                    quantity: item.quantity
                }))
            };

            const response = await axios.post<OrderRow>(
                `${BACKEND_URL}/orders`,
                payload
            );
            console.log('Order created:', response.data);
            setFormData({});

        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(new Error(err.response?.data?.message || err.message));
            } else {
                setError(err as Error);
            }
        } finally {
            setLoading(false);
        }
    };

    // The corrected updateOrderStatus function

    const updateOrderStatus = async (id: number, status: OrderStatus) => {
        // Immediately update the local state with the new status
        setRows(prevRows =>
            prevRows.map(row => (row.id === id ? { ...row, status: status } : row))
        );
        setLoading(true);
        setError(null);

        try {
            // Send the update to the backend without waiting for its response to update the UI
            await axios.patch<OrderRow>(
                `${BACKEND_URL}/orders/${id}`,
                { status }
            );
            // On success, do nothing. The UI is already updated.
        } catch (err) {
            // If the backend request fails, revert the state to the original
            setError(err as Error);
            // To revert, you'll need the original `rows` state. Pass it here if you need to.
            // Or, refetch the data from the backend to ensure consistency.
            fetchOrders();
        } finally {
            setLoading(false);
        }
    }

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, orderItemId: number) => {
        const newQuantity = parseInt(event.target.value, 10);

        if (!isNaN(newQuantity) && newQuantity > 0) {
            setFormData(prev => ({
                ...prev,
                orderItems: (prev.orderItems ?? []).map(item =>
                    item.id === orderItemId
                        ? { ...item, quantity: newQuantity }
                        : item
                ),
            }));
        }
    };

    const calculateTotalAmount = (): number => {
        return (formData.orderItems ?? []).reduce((total, item) => {
            const itemPrice = item.price;
            return total + (itemPrice * item.quantity);
        }, 0);
    };


    // Get selected product IDs for the multi-select component
    const selectedProductIds = (formData.orderItems || []).map(item => item.product.id);

    useEffect(() => {
        fetchOrders();
    }, []);

    return {
        rows,
        loading,
        error,
        fetchOrders,
        createOrder,
        formData,
        handleChange,
        updateOrderStatus,
        handleProductSelectChange,
        handleQuantityChange,
        selectedProductIds,
        fetchArchivedOrders,
        calculateTotalAmount,
    };
}