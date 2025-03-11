import Cart from "@models/cart";
import InputNumber from "./InputNumber";
import { useEffect, useState } from "react";
import ImagePlaceholder from "./ImagePlaceholder";
import IconTrash3 from "@assets/icons/IconTrash3";
import ProductInfoCard from "./ProductInfoCard";

interface CartCount {
    [key: number]: number;
}

interface SelectedCartItem {
    [key: number]: boolean;
}

interface Props {
    cart: Cart;
    cartCount: CartCount;
    updateCartCount: (productId: number, quantity: number) => void;
    selectedCart: SelectedCartItem;
    updateSelectedCartItem: (productId: number, selected: boolean) => void;
    imageUrls: Map<number, string>;
    handleDeleteProduct: (sellerId: string, productId: number) => Promise<void>;
}

const ShopCard: React.FC<Props> = ({ cart, updateCartCount, cartCount, selectedCart, updateSelectedCartItem, imageUrls, handleDeleteProduct }) => {
    const totalPrice = cart.cartDetails.reduce((acc, curr) => {
        return !curr.product || !selectedCart[curr.product.id] ? acc :
            acc + cartCount[curr.product.id] * curr.product?.price;
    }, 0);

    const [isSelectedAll, setIsSelectedAll] = useState(
        cart.cartDetails.every(cd => !cd.product || selectedCart[cd.product.id])
    );

    function handleToggleAllCart(e: React.ChangeEvent<HTMLInputElement>) {
        cart.cartDetails.forEach(cd => {
            if (!cd.product) return;
            updateSelectedCartItem(cd.product.id, e.target.checked);
        });
        setIsSelectedAll(e.target.checked);
    }

    useEffect(() => {
        const allSelected = cart.cartDetails.every(cd => !cd.product || selectedCart[cd.product.id]);
        setIsSelectedAll(allSelected);
    }, [selectedCart, cart.cartDetails]);

    return (
        <div className="">
            <div className="flex bg-[#FFFDFD] border border-gray-200 px-5 py-2">
                <input className="mr-3 cursor-pointer"
                    onChange={handleToggleAllCart}
                    checked={isSelectedAll}
                    type="checkbox"
                />
                <div className="flex justify-between w-full">
                    <p className="font-medium">{cart.ownerName}</p>
                    <p className="font-bold">IDR. {totalPrice.toLocaleString()}</p>
                </div>
            </div>

            {cart.cartDetails.map((cd, idx) => {
                if (!cd.product) {
                    return <p className="flex bg-[#FFFDFD] border border-gray-200 px-5 py-2" key={idx}>Product not found</p>
                }

                const isCurrSelected = selectedCart[cd.product.id] || false

                function handleToggleCart(e: React.ChangeEvent<HTMLInputElement>) {
                    if (!cd.product) return;
                    updateSelectedCartItem(cd.product.id, e.target.checked)
                };

                function updateCartQuantity(value: number) {
                    if (value <= 0 || !cd.product) return;
                    updateCartCount(cd.product.id, value);
                }

                return (
                    <div className="flex bg-[#FFFDFD] border border-gray-200 px-5 py-2" key={idx}>
                        <input className="mr-3 cursor-pointer"
                            checked={isCurrSelected}
                            onChange={handleToggleCart}
                            type="checkbox"
                        />

                        <ProductInfoCard imageUrl={imageUrls.get(cd.product.id)}>
                            <div className="flex flex-col justify-between w-full">
                                <div className="flex w-full justify-between">
                                    <p>{cd.product.name}</p>
                                    <button onClick={() => handleDeleteProduct(cd.product!.owner, cd.product!.id)}
                                        className="size-7"><IconTrash3 /></button>
                                </div>

                                <div className="flex flex-row justify-between">
                                    <p className="font-bold">IDR {cd.product.formatPrice()}</p>
                                    <InputNumber
                                        quantity={cartCount[cd.product.id] || 0}
                                        updateCartQuantity={updateCartQuantity}
                                    />
                                </div>
                            </div>
                        </ProductInfoCard>
                    </div>
                );
            })}
        </div >
    );
}

export default ShopCard;
