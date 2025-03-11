import NavbarIcon from './NavbarIcon';
import IconSearch from '@assets/icons/IconSearch';
import IconCart from '@assets/icons/IconCart';
import IconHeart from '@assets/icons/IconHeart';
import IconPerson from '@assets/icons/IconPerson';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserPopUp from './UserPopup';
import SearchModal from './SearchModal';
import { getAllProductsQuery, getProductImageQuery } from '@/services/productService';
import TypeUtils from '@utils/TypeUtils';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [productImageUrls, setProductImageUrls] = useState<Map<number, string>>(new Map());
    const { getProductImage } = getProductImageQuery();
    const { products, getAllProduct } = getAllProductsQuery();

    const togglePopup = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsUserPopupOpen(prev => !prev);
    };

    const toggleSearchModal = () => {
        setIsSearchModalOpen(prev => !prev);
    };

    async function fetchProducts() {
        const products = await getAllProduct();
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

    useEffect(() => {
        fetchProducts();
    }, [])

    return (
        <nav className="sticky top-0 flex w-screen items-center justify-between p-10 mb-5 bg-white h-[125px] shadow-md z-40">
            <p className="text-[36px] font-marcellus cursor-pointer">
                <Link to="/">BINGBING</Link>
            </p>
            <div className="flex w-[15%] flex-row items-center justify-between">
                <NavbarIcon onclick={toggleSearchModal} icon={<IconSearch />} />
                <NavbarIcon onclick={() => navigate('/cart')} icon={<IconCart />} />
                <NavbarIcon onclick={() => navigate('/favorite')} icon={<IconHeart />} />
                <div className="relative size-6">
                    <NavbarIcon onclick={togglePopup} icon={<IconPerson />} />
                    {isUserPopupOpen && (
                        <UserPopUp isPopupOpen={isUserPopupOpen} closePopup={() => setIsUserPopupOpen(false)} />
                    )}
                </div>
            </div>

            <SearchModal isOpen={isSearchModalOpen} onClose={toggleSearchModal} products={products} productImageUrls={productImageUrls}/>
        </nav>
    );
};

export default Navbar;
