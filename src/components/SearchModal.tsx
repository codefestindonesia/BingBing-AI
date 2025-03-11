import ProductCard from "./ProductCard";
import Product from "@models/product";
import IconSearch from "@assets/icons/IconSearch";
import { useEffect, useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    productImageUrls: Map<number, string>;
}

const SearchModal:React.FC<Props> = ({ isOpen, onClose, products, productImageUrls }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setIsLoading(true);

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.clothingType.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResult(filteredProducts);
        setIsLoading(false);
    };

    return(
        <div className="fixed px-32 py-20 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-full relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-xl">x</button>
                <div className="flex justify-center items-center mt-3 mx-[2.5%] px-[2%] mb-10 border border-gray-300 rounded-md">
                    <div className="w-5 h-5">
                        <IconSearch />
                    </div>
                    
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            handleSearch(e);
                        }}
                        placeholder="Search for products..."
                        className="w-full p-3 focus:outline-none"
                    />

                </div>

                {isLoading?
                    <div className="flex justify-center items-center animate-pulse">
                        Loading...
                    </div>
                :
                    <div className="grid grid-cols-5 gap-x-[3.5%] gap-y-8 px-[2.5%] w-full">
                        {searchResult?.map((p, idx) => (
                            <ProductCard imageUrl={productImageUrls.get(p.id)} product={p} key={idx}/>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}

export default SearchModal;