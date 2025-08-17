import { Product } from "@/app/interfaces/data";
import axios from "axios";
import { useEffect, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useProducts() {
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    // fetch products
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<Product[]>(`${BACKEND_URL}/products`);
            setProducts(response.data);
        } catch (err: any) {
            setError(new Error(err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // create product
    const createProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.post<Product>(`${BACKEND_URL}/products`, formData);
            await fetchProducts(); // ✅ refetch after creation
            setFormData({}); // optional: clear form
        } catch (err: any) {
            setError(new Error(err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // delete product
    const deleteProductById = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`${BACKEND_URL}/products/${id}`);
            setProducts((prev) => prev.filter((product) => product.id !== id));
        } catch (err: any) {
            setError(new Error(err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        formData,
        handleChange,
        createProducts,
        loading,
        error,
        setProducts,
        products,
        deleteProductById,
        fetchProducts, // expose it too, in case UI needs manual refresh
    };
}
