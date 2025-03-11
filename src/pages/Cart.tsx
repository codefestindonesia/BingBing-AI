import { getSelfCartQuery, removeSelfCartItemUpdate } from "@/services/cartService";
import { deleteProductUpdate, getProductImageQuery } from "@/services/productService";
import ShopCard from "@components/ShopCard";
import useAuthContext from "@hooks/useAuthContext";
import useServiceContext from "@hooks/useServiceContext";
import NavbarLayout from "@layouts/NavbarLayout";
import { Transaction } from "@models/transaction";
import TypeUtils from "@utils/TypeUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface CartCount {
    [key: number]: number;
}

interface SelectedCartItem {
    [key: number]: boolean;
}

const Carts: React.FC = () => {
    const navigate = useNavigate();
    const { getIdentity } = useAuthContext();
    const { productCanisterId, userCanisterId } = useServiceContext();

    const [cartCount, setCartCount] = useState<CartCount>({});
    const [imageUrls, setImageUrls] = useState<Map<number, string>>(new Map());
    const [selectedCartItem, setSelectedCartItem] = useState<SelectedCartItem>({});

    const [isCartEmpty, setIsCartEmpty] = useState(true);

    const { carts, getSelfCart, getSelfCartLoading } = getSelfCartQuery();
    const { getProductImage } = getProductImageQuery();
    const { removeSelfCartItem, removeSelfCartItemLoading } = removeSelfCartItemUpdate();

    const cartTotalPrice = carts?.reduce((acc, curr) => {
        return acc + curr.cartDetails.reduce((acc, curr) => {
            return (!curr.product || !selectedCartItem[curr.product.id]) ? acc :
                acc + cartCount[curr.product.id] * curr.product.price;
        }, 0);
    }, 0);

    function updateCartFormData() {
        if (!carts) return;
        setIsCartEmpty(!carts.some(c => c.cartDetails.length > 0));

        const cartCount: CartCount = {};
        carts.forEach(cart => {
            cart.cartDetails.forEach(cd => {
                if (!cd.product) return;
                cartCount[cd.product.id] = cd.quantity;
            })
        })
        setCartCount(cartCount);

        const selectedCart: SelectedCartItem = {};
        carts.forEach(cart => {
            cart.cartDetails.forEach(cd => {
                if (!cd.product) return;
                selectedCart[cd.product.id] = true;
            })
        })
        setSelectedCartItem(selectedCart);
    }

    async function fetchCartData() {
        const carts = await getSelfCart([productCanisterId, userCanisterId]);
        if (!carts || 'err' in carts) return;

        carts.ok.forEach(cart => {
            cart.products.forEach(async p => {
                if (!p.product || p.product.length === 0) return;
                const image = await getProductImage([p.product[0].id]);
                if (!image || image.length === 0) {
                    return;
                };
                setImageUrls(prev => {
                    if (p.product.length === 0) return prev;
                    const newMap = new Map(prev);
                    newMap.set(Number(p.product[0].id), TypeUtils.byteArrayToImageURL(image[0]));
                    return newMap;
                })
            })
        })
    }

    function updateCartCount(productId: number, quantity: number) {
        setCartCount(prev => {
            const newCartCount = { ...prev, [productId]: quantity };
            return newCartCount;
        });
    }

    function updateSelectedCartItem(productId: number, selected: boolean) {
        setSelectedCartItem(prev => {
            const newSelectedCartItem = { ...prev, [productId]: selected };
            return newSelectedCartItem
        });
    }

    async function handleDeleteProduct(sellerId: string, productId: number) {
        const res = await removeSelfCartItem([sellerId, BigInt(productId)]);
        if (!res || 'err' in res) return;
        await fetchCartData();
        Swal.fire('Success', 'Product has been deleted', 'success');
    }

    async function handleToCheckout() {
        const transaction: Transaction[] = [];

        carts?.forEach(cart => {
            const ownerName = cart.ownerName;
            const items = cart.cartDetails
                .filter(cd => cd.product && selectedCartItem[cd.product.id])
                .map(cd => {
                    return {
                        product: cd.product!,
                        quantity: BigInt(cartCount[cd.product?.id || 0])
                    }
                })
            if (items.length === 0) return;
            transaction.push({ ownerName, items });
        });

        if (transaction.length === 0) {
            Swal.fire('Error', 'Please select at least one product', 'error');
            return;
        }

        navigate('/checkout', {
            state: {
                transaction,
                imageUrls,
            }
        });

    }

    useEffect(() => {
        updateCartFormData();
    }, [carts])

    useEffect(() => {
        fetchCartData();
    }, [])

    if (getSelfCartLoading || removeSelfCartItemLoading) {
        return (
            <NavbarLayout>
                <div className="flex justify-center text-2xl font-semibold text-gray-700 animate-pulse mt-10">
                    Loading...
                </div>
            </NavbarLayout>
        )
    }

    if (isCartEmpty) {
        return (
            <NavbarLayout>
                <div className="flex justify-center text-2xl font-semibold text-gray-700 mt-10">
                    Your cart is empty
                </div>
            </NavbarLayout>
        )
    }

    return (
        <NavbarLayout>
            <p className="self-start px-20 text-3xl font-medium">Cart</p>

            <div className="flex w-full justify-between py-5 px-20">
                <div className="flex flex-col w-[60%] mr-10 gap-8">
                    {carts?.map((cart, idx) => {
                        return <ShopCard key={idx}
                            cart={cart}
                            cartCount={cartCount}
                            updateCartCount={updateCartCount}
                            selectedCart={selectedCartItem}
                            updateSelectedCartItem={updateSelectedCartItem}
                            imageUrls={imageUrls}
                            handleDeleteProduct={handleDeleteProduct}
                        />
                    })}
                </div>

                <div className="bg-[#FFFDFD] w-[50%] h-fit p-5 border-gray-200 border">
                    <p className="mb-5 font-bold text-2xl">Order Summary</p>

                    <div className="flex justify-between mb-3">
                        <p className="text-xl">Total</p>
                        <p className="text-xl font-bold">{cartTotalPrice?.toLocaleString()}</p>
                    </div>

                    <hr className="border-black mb-5" />

                    <button onClick={handleToCheckout}
                        className="w-full p-3 bg-black text-white font-bold rounded">Check Out</button>
                </div>
            </div>
        </NavbarLayout>
    )
}

export default Carts;