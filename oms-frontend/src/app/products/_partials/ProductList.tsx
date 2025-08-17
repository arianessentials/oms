'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Container,
    CircularProgress,
    Alert,
    ButtonGroup
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Product } from '@/app/interfaces/data';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

interface ProductListProps {
    products: Product[];
    loading: boolean;
    error: Error | null;
    deleteProductById: (id: number) => void;
}

export default function ProductList({
    products,
    loading,
    error,
    deleteProductById,
}: ProductListProps) {
    const [showKHR, setShowKHR] = useState(false);

    const toggleCurrency = () => setShowKHR(prev => !prev);


    useEffect(() => {
        const lightbox = GLightbox({ selector: '.glightbox' });
        return () => lightbox.destroy();
    }, [products]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                    p: 3
                }}
            >
                <CircularProgress size={48} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, sm: 3 } }}>
            {error && (
                <Box sx={{ mb: 3 }}>
                    <Alert severity="error">{error.message}</Alert>
                </Box>
            )}

            {products.length === 0 && !loading && (
                <Box sx={{ mb: 3 }}>
                    <Alert severity="info">No products found.</Alert>
                </Box>
            )}

            <Grid container spacing={3}>
                {products.map((product) => {
                    const khrPrice = product.price * 4000;

                    return (   // ← you need to return the JSX here
                        <Grid xs={12} sm={6} md={4} key={product.id} sx={{ display: 'flex' }}>
                            <Card
                                sx={{
                                    width: 300,
                                    minHeight: 400,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: '#fafafa',
                                    border: '1px solid #ddd',
                                    boxShadow: 'none',
                                    borderRadius: 2,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: '#f5f7fa',
                                        borderColor: '#bbb',
                                        '& .product-image': {
                                            transform: 'scale(1.03)',
                                        },
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: 180,
                                        overflow: 'hidden',
                                        borderBottom: '1px solid #eee',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <a
                                        className="glightbox"
                                        href={product.images?.[0] || './placeholder.png'}
                                        data-gallery={`gallery-${product.id}`}
                                        data-title={product.name}
                                    >
                                        <CardMedia
                                            component="img"
                                            className="product-image"
                                            image={product.images?.[0] || './placeholder.png'}
                                            alt={product.name}
                                        />
                                    </a>
                                </Box>

                                <CardContent
                                    sx={{
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        p: 2.5,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '1.15rem',
                                            mb: 1,
                                            color: '#111',
                                        }}
                                    >
                                        {product.name}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: '0.9rem',
                                            lineHeight: 1.3,
                                            color: '#555',
                                            mb: 2,
                                            flexGrow: 1,
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {product.description}
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        component="h2"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '1.15rem',
                                            mb: 1,
                                            color: '#111',
                                            cursor: 'pointer',
                                        }}
                                        onClick={toggleCurrency}
                                    >
                                        {showKHR ? `${khrPrice.toLocaleString()} KHR` : `$${product.price}`}
                                    </Typography>
                                </CardContent>

                                <CardActions sx={{ p: 2.5, pt: 0, mt: 'auto' }}>
                                    <ButtonGroup
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            '& .MuiButton-root': {
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                py: 0.5,
                                                textTransform: 'none',
                                                borderRadius: 1,
                                            },
                                        }}
                                    >
                                        <Button
                                            sx={{
                                                backgroundColor: '#f5c518',
                                                color: '#111',
                                                '&:hover': {
                                                    backgroundColor: '#e5b210',
                                                },
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => deleteProductById(product.id)}
                                            sx={{
                                                backgroundColor: '#f44336',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#d32f2f',
                                                },
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </ButtonGroup>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}

            </Grid>
        </Container>
    );
}
