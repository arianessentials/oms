'use client'
import { useProducts } from "../hooks/productHooks/useProducts";
import ProductCreateForm from "./_partials/ProductCreateForm";
import ProductList from "./_partials/ProductList";


export default function Products() {
    const productsState = useProducts();
    return (
        <>
            <ProductCreateForm
                formData={productsState.formData}
                handleChange={productsState.handleChange}
                createProducts={productsState.createProducts}
                loading={productsState.loading}
                error={productsState.error} />

            <ProductList
                products={productsState.products}
                loading={productsState.loading}
                error={productsState.error}
                deleteProductById={productsState.deleteProductById}
            />
        </>
    );
}