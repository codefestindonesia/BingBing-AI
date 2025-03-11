import useServiceContext from "@hooks/useServiceContext";
import Product from "@models/product";
import { useState } from "react";

export function getAllProductsWithPaginationQuery() {
    const { useQueryCall: productQuery } = useServiceContext().productService;

    const [products, setProducts] = useState<Product[]>([]);
    const { call: getAllProducts, loading: getAllProductsLoading } = productQuery({
        functionName: "getProducts",
        onSuccess: (productData) => {
            setProducts(productData?.map(Product.fromProductData) ?? []);
        },
        refetchOnMount: false
    });
    return { products, getAllProducts, getAllProductsLoading };
}

export function getAllProductsQuery() {
    const { useQueryCall: productQuery } = useServiceContext().productService;

    const [products, setProducts] = useState<Product[]>([]);
    const { call: getAllProduct, loading: getAllProductsLoading } = productQuery({
        functionName: "getAllProduct",
        onSuccess: (productData) => {
            setProducts(productData?.map(Product.fromProductData) ?? []);
        },
        refetchOnMount: false
    });
    return { products, getAllProduct, getAllProductsLoading };
}

export function getProductQuery() {
    const { useQueryCall: productQuery } = useServiceContext().productService;
    const [product, setProduct] = useState<Product | undefined | null>(null);
    const { call: getProduct, loading: getProductLoading } = productQuery({
        functionName: "getProduct",
        onSuccess: (productData) => {
            if (productData && productData.length === 1) {
                setProduct(Product.fromProductData(productData[0]));
            }
        },
        refetchOnMount: false
    });

    return { product, getProduct, getProductLoading };
}

export function getProductsByOwnerQuery() {
    const { useQueryCall: productQuery } = useServiceContext().productService;
    const [products, setProducts] = useState<Product[]>([]);
    const { call: getProductsByOwner, loading: getProductsByOwnerLoading } = productQuery({
        functionName: "getProductsByOwner",
        onSuccess: (productData) => {
            setProducts(productData?.map(Product.fromProductData) ?? [])
        },
        refetchOnMount: false
    });

    return { products, getProductsByOwner, getProductsByOwnerLoading };
}

export function createProductUpdate() {
    const { useUpdateCall: productUpdate } = useServiceContext().productService;
    const { call: createProduct, loading: createProductLoading } = productUpdate({
        functionName: "createProduct",
    })

    return { createProduct, createProductLoading };
}

export function editProductUpdate() {
    const { useUpdateCall: productUpdate } = useServiceContext().productService;
    const { call: editProduct, loading: editProductLoading } = productUpdate({
        functionName: "updateProduct",
    })

    return { editProduct, editProductLoading };
}

export function deleteProductUpdate() {
    const { useUpdateCall: productUpdate } = useServiceContext().productService;
    const { call: deleteProduct, loading: deleteProductLoading } = productUpdate({
        functionName: "deleteProduct",
    })

    return { deleteProduct, deleteProductLoading };
}

export function getProductImageQuery() {
    const { useQueryCall: productQuery } = useServiceContext().productService;
    const { call: getProductImage, loading: getProductImageLoading } = productQuery({
        functionName: 'getProductImage',
        refetchOnMount: false
    })
    return { getProductImage, getProductImageLoading };
}