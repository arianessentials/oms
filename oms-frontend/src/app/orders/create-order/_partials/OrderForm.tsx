import React from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    CircularProgress,
    Select,
    MenuItem,
    Chip,
    FormControl,
    InputLabel
} from "@mui/material";
import { useOrders } from "@/app/hooks/orderHooks/useOrder";
import { useProducts } from "@/app/hooks/productHooks/useProducts";

export default function OrderForm() {
    const {
        formData,
        handleChange,
        handleTextareaChange,
        handleQuantityChange,
        handleProductSelectChange,
        createOrder,
        loading,
        error,
        selectedProductIds,
        calculateTotalAmount
    } = useOrders();

    const { products, loading: productsLoading } = useProducts();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createOrder();
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 3,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    boxShadow: 1
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Create New Order
                </Typography>

                {productsLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <FormControl fullWidth>
                        <InputLabel id="product-select-label">Select Products</InputLabel>
                        <Select
                            multiple
                            labelId="product-select-label"
                            value={selectedProductIds}
                            onChange={(e) => handleProductSelectChange(e, products)}
                            renderValue={(selected) => (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {selected.map((id) => {
                                        const product = products.find(p => p.id === id);
                                        return <Chip key={id} label={product?.name} />;
                                    })}
                                </Box>
                            )}
                        >
                            {products.map(product => (
                                <MenuItem key={product.id} value={product.id}>
                                    {product.name} - ${product.price}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {(formData.orderItems ?? []).map(item => (
                    <Box
                        key={item.id}
                        sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: "1px solid #eee", borderRadius: 1 }}
                    >
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography>{item.product.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                ${item.price} each
                            </Typography>
                        </Box>
                        <TextField
                            label="Quantity"
                            type="number"
                            value={item.quantity === 0 ? '' : item.quantity}
                            onChange={(e) => handleQuantityChange(e as React.ChangeEvent<HTMLInputElement>, item.id)}
                            sx={{ width: 120 }}
                            error={item.quantity === 0}
                            helperText={item.quantity === 0 ? "Required" : ""}
                        />
                        <Typography sx={{ minWidth: 80, textAlign: "right" }}>
                            Total: ${(item.quantity * item.price).toFixed(2)}
                        </Typography>
                    </Box>
                ))}

                {formData.orderItems?.length ? (
                    <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1, display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h6">Order Total:</Typography>
                        <Typography variant="h6" color="primary">
                            ${calculateTotalAmount().toFixed(2)}
                        </Typography>
                    </Box>
                ) : null}

                <TextField
                    label="Delivery Address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleTextareaChange}
                    multiline
                    rows={4}
                    fullWidth
                    required
                />

                <TextField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={loading || productsLoading || !formData.orderItems?.length || formData.orderItems?.some(item => item.quantity <= 0)}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Order'}
                </Button>

                {error && (
                    <Typography color="error" align="center" sx={{ mt: 1 }}>
                        Error: {error.message}
                    </Typography>
                )}
            </Box>
        </Container>
    );
}
