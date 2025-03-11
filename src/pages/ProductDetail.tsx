import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import IconHeart from "@assets/icons/IconHeart";
import NavbarLayout from "@layouts/NavbarLayout";
import { getProductImageQuery, getProductQuery } from "@/services/productService";
import { addOrUpdateCartUpdate } from "@/services/cartService";
import ImagePlaceholder from "@components/ImagePlaceholder";
import TypeUtils from "@utils/TypeUtils";
import Swal from "sweetalert2";
import useAuthContext from "@hooks/useAuthContext";
import { getUserQuery } from "@/services/userService";
import User from "@models/user";
import IconPerson from "@assets/icons/IconPerson";
import { addToFavoriteUpdate } from "@/services/favoriteService";
import CategoryBubble from "@components/CategoryBubble";

const ProductDetail: React.FC = () => {
    const navigate = useNavigate();
    let { id } = useParams();
    const { getIdentity } = useAuthContext();
    const [productImageUrl, setProductImageUrl] = useState<string | undefined | null>(null);

    const [ownerProfile, setOwnerProfile] = useState<User | undefined | null>();

    const { getUser, getUserLoading } = getUserQuery();
    const { getProductImage } = getProductImageQuery();
    const { product, getProduct, getProductLoading } = getProductQuery();
    const { addOrUpdateCart, addOrUpdateCartLoading } = addOrUpdateCartUpdate()
    const { addToFavorite, addFavoriteLoading } = addToFavoriteUpdate();

    async function fetchProductData() {
        if (!id) return;
        const product = await getProduct([BigInt(Number.parseInt(id)), []]);
        if (!product || 'err' in product) {
            return;
        }
        const image = await getProductImage([BigInt(Number.parseInt(id))]);
        if (!image || image.length === 0) {
            return;
        }
        setProductImageUrl(TypeUtils.byteArrayToImageURL(image[0]));
    }

    async function handleAddOrUpdateCart() {
        if (!product) return;
        console.log(product.owner);
        const result = await addOrUpdateCart([product.owner, BigInt(product.id), BigInt(1)]);
        if (!result || 'err' in result) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to add product to cart',
                icon: 'error',
                confirmButtonText: 'OK'
            })
            return;
        }
        Swal.fire({
            title: 'Success',
            text: 'Product has been added to cart',
            icon: 'success',
            confirmButtonText: 'OK'
        })
        navigate(-1);
    }

    async function fetchUserData() {
        if (!product) return;
        const result = await getUser([[product.owner!]]);
        if (!result || 'err' in result) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to fetch product owner data',
                icon: 'error',
                confirmButtonText: 'OK'
            })
            return;
        }
        setOwnerProfile(User.castToUser(result.ok));
    }

    async function handleAddToFavorite() {
        const result = await addToFavorite([BigInt(product?.id!)]);
        if (!result || 'err' in result) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to add product to favorite',
                icon: 'error',
                confirmButtonText: 'OK'
            })
            return;
        }
        Swal.fire({
            title: 'Success',
            text: 'Product has been added to favorite',
            icon: 'success',
            confirmButtonText: 'OK'
        })
    }

    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [product])

    if (getProductLoading) {
        return (
            <NavbarLayout>
                <p className="flex justify-center text-2xl font-semibold text-gray-700 animate-pulse mt-10">
                    Loading...
                </p>
            </NavbarLayout>
        )
    }

    if (getIdentity()?.getPrincipal().toText() !== product?.owner) {
        return <NavbarLayout>
            {product ? (
                <div className="flex w-full px-20 py-10">
                    <div className="w-[40%]">
                        <ImagePlaceholder imageUrl={productImageUrl} />
                    </div>

                    <div className="flex flex-col justify-between w-full mx-10">
                        <div className="flex">
                            <div className="mb-32 w-full">
                                <p className="text-4xl font-bold">{product?.name}</p>
                                <p className="text-2xl">IDR. {product.formatPrice()}</p>
                                <div className="flex gap-1 py-2">
                                    <CategoryBubble category={product.gender}/>
                                    <CategoryBubble category={product.season}/>
                                    <CategoryBubble category={product.clothingType}/>
                                    <CategoryBubble category={product.clothing}/>
                                </div>
                                <p className={`italic ${product.stock <= 3 ? 'text-red-500': ''}`}>Stock: {product.stock}</p>
                                <Link to={`/profile/${product.owner}`}>
                                    <div className="flex gap-2 mt-2 items-center">
                                        <div className="size-8 rounded-full border border-gray-500 p-1">
                                            {ownerProfile?.image ?
                                                <img className="size-full object-cover" src={ownerProfile?.image} /> :
                                                <IconPerson width="100%" height="100%" />
                                            }
                                        </div>
                                        <p>{ownerProfile?.name}</p>
                                    </div>
                                </Link>
                            </div>

                            <button onClick={handleAddToFavorite} className="w-10 h-fit">
                                <IconHeart />
                            </button>

                        </div>

                        <div className="space-y-5">
                            {addOrUpdateCartLoading ?
                                <button className="w-full bg-gray-400 text-white font-bold border-black border-2 p-3 text-lg">
                                    Loading...
                                </button> :
                                <button onClick={handleAddOrUpdateCart}
                                    className="w-full bg-black border-black border-2 p-3 text-white text-lg font-bold">
                                    ADD TO CART
                                </button>
                            }
                            <button onClick={() => navigate(`/tryon/${id}`)}
                                className="w-full bg-white border-black border-2 p-3 text-lg font-bold">
                                TRY ON
                            </button>
                        </div>

                        <p className="italic text-sm">
                            *Colors may appear different due to variations in screen lighting.
                        </p>
                    </div>
                </div>
            ) :
                product === undefined ? (
                    <p className="flex justify-center text-2xl font-semibold text-gray-700 animate-pulse mt-10">Loading...</p>
                ) :
                    (
                        <p>Product not found</p>
                    )}
        </NavbarLayout>
    }

    return (
        <NavbarLayout>
            {product ? (
                <div className="flex w-full px-20 py-10">
                    <div className="w-[40%]">
                        <ImagePlaceholder imageUrl={productImageUrl} />
                    </div>

                    <div className="flex flex-col justify-between w-full mx-10">
                        <div className="flex flex-col">
                            <div className="mb-32">
                                <p className="text-4xl font-bold">{product?.name}</p>
                                <p className="text-2xl">Rp. {product.formatPrice()}</p>
                                <div className="flex gap-1 py-2">
                                    <CategoryBubble category={product.gender}/>
                                    <CategoryBubble category={product.season}/>
                                    <CategoryBubble category={product.clothingType}/>
                                    <CategoryBubble category={product.clothing}/>
                                </div>
                                <p className={`italic ${product.stock <= 3 ? 'text-red-500': ''}`}>Stock: {product.stock}</p>
                                <Link to={`/profile/${product.owner}`}>
                                    <div className="flex gap-2 mt-2 items-center">
                                        <div className="size-8 rounded-full border border-gray-500 p-1">
                                            {ownerProfile?.image ?
                                                <img className="size-full object-cover" src={ownerProfile?.image} /> :
                                                <IconPerson width="100%" height="100%" />
                                            }
                                        </div>
                                        <p>{ownerProfile?.name}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {addOrUpdateCartLoading ?
                                <button className="w-full bg-gray-400 text-white font-bold border-black border-2 p-3 text-lg">
                                    Loading...
                                </button> :
                                <button onClick={() => navigate(`/editProduct/${id}`)}
                                    className="w-full bg-black border-black border-2 p-3 text-white text-lg font-bold">
                                    EDIT PRODUCT DETAILS
                                </button>
                            }
                            <button onClick={() => navigate(`/tryon/${id}`)}
                                className="w-full bg-white border-black border-2 p-3 text-lg font-bold">
                                TRY ON
                            </button>
                        </div>

                        <p className="italic text-sm">
                            *Colors may appear different due to variations in screen lighting.
                        </p>
                    </div>
                </div>
            ) :
                product === undefined ? (
                    <p className="flex justify-center text-2xl font-semibold text-gray-700 animate-pulse mt-10">Loading...</p>
                ) :
                    (
                        <p>Product not found</p>
                    )}
        </NavbarLayout>
    )
}

export default ProductDetail;