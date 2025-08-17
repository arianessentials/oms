import React from 'react';
import { Box, TextField, Button, Typography, Container, CircularProgress } from '@mui/material';
import { Product } from '@/app/interfaces/data';

interface ProductCreateFormProps {
    formData: Partial<Product>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    createProducts: () => Promise<void>;
    loading: boolean;
    error: Error | null;
}

function ProductCreateForm({
    formData,
    handleChange,
    createProducts,
    loading,
    error
}: ProductCreateFormProps) {

    const handleSubmit = (e: any) => {
        e.preventDefault();
        createProducts();
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 3,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    boxShadow: 1
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Create New Product
                </Typography>

                <TextField
                    label="Product Name"
                    name="name"
                    value={formData.name ?? ""}  // controlled
                    onChange={handleChange}
                    required
                    fullWidth
                />

                <TextField
                    label="Description"
                    name="description"
                    value={formData.description ?? ""}  // controlled
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                />

                <TextField
                    label="Price"
                    name="price"
                    value={formData.price ?? ""}  // controlled
                    onChange={handleChange}
                    fullWidth
                />

                <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                >
                    Upload Images
                    <input
                        type="file"
                        name="images"
                        multiple
                        hidden
                        accept="image/*"
                        onChange={handleChange}
                    />
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Product'}
                </Button>

                {error && (
                    <Typography color="error" align="center">
                        Error: {error.message}
                    </Typography>
                )}
            </Box>
        </Container>
    );
}

export default ProductCreateForm;