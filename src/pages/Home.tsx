import React, { useEffect, useState } from 'react';
import NavbarLayout from '@layouts/NavbarLayout';
import CategoryBar from '@components/CategoryBar';
import { getAllProductsQuery, getAllProductsWithPaginationQuery, getProductImageQuery } from '@/services/productService';
import ProductCard from '@components/ProductCard';
import Product from '@models/product';
import TypeUtils from '@utils/TypeUtils';
import { genderSelection, seasonSelection, typeSelection } from '@models/category';
import IconNext from '@assets/icons/IconNext';
import IconPrev from '@assets/icons/IconPrev';

const sortOptions = ['From Lowest Price', 'From Highest Price'];

const Home: React.FC = () => {
    const [sort, setSort] = useState<string>(sortOptions[0]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [category, setCategory] = useState<string>('All');
    const { products, getAllProducts, getAllProductsLoading } = getAllProductsWithPaginationQuery();
    const { products: allProduct, getAllProduct } = getAllProductsQuery();
    const [productImageUrls, setProductImageUrls] = useState<Map<number, string>>(new Map());
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const { getProductImage } = getProductImageQuery();

    const itemsPerPage = 10;

    const filterProducts = () => {
        if((genderSelection as unknown as string[]).includes(category)){
            setFilteredProducts(products.filter((product) => product.gender === category))
        } else if((seasonSelection as unknown as string[]).includes(category)){
            setFilteredProducts(products.filter((product) => product.season === category))
        } else if((typeSelection as unknown as string[]).includes(category)){
            setFilteredProducts(products.filter((product) => product.clothingType === category))
        }else{
            setFilteredProducts([])
        }
    }
    
    async function fetchProducts(pageNumber: number) {
        const products = await getAllProducts([BigInt(pageNumber)]);

        if(products){
            products?.forEach(async p => {
                const image = await getProductImage([p.id]);
                if (!image || image.length === 0) {
                    return;
                };
                setProductImageUrls(prev => {
                    const newMap = new Map(prev);
                    newMap.set(Number(p.id), TypeUtils.byteArrayToImageURL(image[0]));
                    return newMap;
                })
            })
        }
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            fetchProducts(newPage);
        }
    };

    const fetchAllProducts = async () => {
        await getAllProduct([]);
    }

    useEffect(() => {
        filterProducts();
        fetchProducts(page);
    }, [category, page]);

    useEffect(()=>{
        fetchAllProducts();
    }, [])

    useEffect(() => {
        const productLength = allProduct?.length

        setTotalPages(Math.ceil(productLength / itemsPerPage));
    }, [allProduct])

    if (getAllProductsLoading) {
        return (
            <NavbarLayout>
                <div className="flex justify-center text-2xl font-semibold text-gray-700 animate-pulse mt-10">Loading...</div>
            </NavbarLayout>
        )
    }


    return (
        <NavbarLayout>
            <CategoryBar category={category} setCategory={setCategory} />
            <div className="sticky w-screen mt-3 mb-8 flex items-center justify-end gap-4 px-[2.5%] py-2 z-20 bg-white">
                <p>Sort: </p>
                <select
                    className="border border-black p-2 text-xs cursor-pointer"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    {sortOptions.map((option, index) => (
                        <option className="text-xs" key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-5 gap-x-[3.5%] gap-y-8 px-[2.5%] w-full">
                {category === "All" ?
                    products.sort((a, b) => {
                        if (sort === sortOptions[0]) {
                            return a.price - b.price;
                        }
                        return b.price - a.price
                    }).map((product) => (
                        <ProductCard key={product.id} product={product} imageUrl={productImageUrls.get(product.id)}/>
                    ))
                    :
                    filteredProducts.sort((a, b) => {
                        if (sort === sortOptions[0]) {
                            return a.price - b.price;
                        }
                        return b.price - a.price
                    }).map((product) => (
                        <ProductCard key={product.id} product={product} imageUrl={productImageUrls.get(product.id)}/>
                    ))
                }
            </div>
            {totalPages >= 1 && 
                <div className="flex justify-center mt-20 mx-20 items-center">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className={`w-6 h-6 ${page <= 1 ? 'opacity-50' : ''}`}
                    >
                        <IconPrev />
                    </button>
                    <p className="mx-2 text-xl">{page}</p>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page == totalPages}
                        className={`w-6 h-6 ${page >= totalPages ? 'opacity-50' : ''}`}
                    >
                        <IconNext />
                    </button>
                </div>
            }
        </NavbarLayout>
    );
};

export default Home;
