import { deleteProductUpdate, getProductImageQuery, getProductsByOwnerQuery } from "@/services/productService";
import { mintUpdate } from "@/services/tokenService";
import { getUserQuery } from "@/services/userService";
import IconPerson from "@assets/icons/IconPerson";
import IconWallet from "@assets/icons/IconWallet";
import ButtonSmall from "@components/ButtonSmall";
import DeleteProductModal from "@components/DeleteProductModal";
import ProfileProductCard from "@components/ProfileProductCard";
import TopUpModal from "@components/TopUpModal";
import useAuthContext from "@hooks/useAuthContext";
import useServiceContext from "@hooks/useServiceContext";
import { useAuth } from "@ic-reactor/react";
import NavbarLayout from "@layouts/NavbarLayout"
import Product from "@models/product";
import User from "@models/user";
import TypeUtils from "@utils/TypeUtils";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Profile: React.FC = () => {
    const { cartCanisterId } = useServiceContext();
    const { principal } = useParams();
    const { identity } = useAuth();
    const { getUser } = getUserQuery()
    const { user, balance, fetchUser } = useAuthContext();
    const [profileUser, setProfileUser] = useState<User | null | undefined>(undefined);

    const { products, getProductsByOwner } = getProductsByOwnerQuery();
    const [productImageUrls, setProductImageUrls] = useState<Map<number, string>>(new Map());

    const { getProductImage } = getProductImageQuery();
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
    const { deleteProduct, deleteProductLoading } = deleteProductUpdate();

    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState(0);
    const { mint, mintLoading } = mintUpdate();

    async function fetchProductsByOwner() {
        const productWithoutImages = await getProductsByOwner([principal ?? '']);
        productWithoutImages?.forEach(async (product) => {
            const image = await getProductImage([product.id]);
            if (!image || image.length === 0) {
                return;
            }
            setProductImageUrls(prev => {
                const newMap = new Map(prev);
                newMap.set(Number(product.id), TypeUtils.byteArrayToImageURL(image[0]));
                return newMap;
            })
        })
    }

    async function handleDeleteProduct() {
        const result = await deleteProduct([BigInt(selectedProduct?.id ?? 0), cartCanisterId]);
        if (!result || 'err' in result) {
            Swal.fire({
                title: "Failed to delete product",
                icon: "error"
            })
            return;
        }
        await fetchProductsByOwner();
        Swal.fire({
            title: "Success!",
            text: "Successfully delete product",
            icon: "success"
        });
        setSelectedProduct(undefined);
    }

    async function handleTopUp() {
        const principal = identity?.getPrincipal();
        if (!principal) {
            return;
        }
        if (topUpAmount <= 0) {
            Swal.fire({
                title: "Invalid top up amount",
                text: "Top up amount must be greater than 0",
                icon: "error"
            });
            return;
        }
        const result = await mint([principal, BigInt(topUpAmount)]);
        if (!result || 'err' in result) {
            Swal.fire({
                title: "Failed to top up",
                icon: "error"
            });
            return;
        }

        await fetchUser();

        Swal.fire({
            title: "Success!",
            text: `Successfully top up ${topUpAmount} !`,
            icon: "success"
        })
        setIsTopUpModalOpen(false);
        setTopUpAmount(0);
    }

    async function fetchProfileUser() {
        const currPrincipal = identity?.getPrincipal();
        if (currPrincipal && principal !== currPrincipal.toText()) {
            const result = await getUser([[principal!]])
            if (!result) {
                Swal.fire({
                    title: "Failed to fetch user",
                    icon: "error"
                })
                return;
            }
            if ('err' in result) {
                Swal.fire({
                    title: "Failed to fetch user",
                    text: result.err,
                    icon: "error"
                })
                return;
            }
            setProfileUser(User.castToUser(result.ok));
        }
    }

    function closeTopUpModal() {
        if (mintLoading) return;
        setIsTopUpModalOpen(false);
    }

    function closeDeleteProductModal() {
        if (deleteProductLoading) return;
        setSelectedProduct(undefined);
    }

    useEffect(() => {
        if (principal) {
            fetchProductsByOwner();
            fetchProfileUser();
        }
    }, [])

    if (principal === identity?.getPrincipal().toText()) {
        return (
            <NavbarLayout>
                {selectedProduct &&
                    <DeleteProductModal onClose={closeDeleteProductModal}
                        product={selectedProduct}
                        handleDeleteProduct={handleDeleteProduct}
                        isLoading={deleteProductLoading}
                    />
                }
                {isTopUpModalOpen &&
                    <TopUpModal onClose={closeTopUpModal}
                        handleTopUp={handleTopUp}
                        onChange={(e) => setTopUpAmount(Number(e.target.value))}
                        value={topUpAmount}
                        isLoading={mintLoading}
                    />
                }
                <div className="w-screen px-[2.5%] py-2">
                    <div className="flex justify-between items-center gap-5">
                        <div className="flex gap-10">
                            <div className="size-32 rounded-full border border-gray-400 overflow-hidden flex items-end justify-center">
                                {user?.image ?
                                    <img className="w-full h-full object-cover" src={user?.image} /> :
                                    <IconPerson width="80%" height="80%" />
                                }
                            </div>
                            <div>
                                <p className="text-[32px] font-semibold">{user?.name}</p>
                                <div className="flex gap-5 items-center">
                                    <div className="flex gap-1 items-center">
                                        <div className="h-8"><IconWallet /></div>
                                        <p>BingPay: {balance.toLocaleString()}</p>
                                    </div>
                                    <ButtonSmall onclick={() => setIsTopUpModalOpen(true)} variant="secondary" text="Top up" />
                                </div>
                            </div>
                        </div>
                        <div className="flex h-full gap-10">
                            <Link to="/editProfile">
                                <ButtonSmall text="Edit Profile" />
                            </Link>
                            <Link to="/addProduct">
                                <ButtonSmall text="Add Product" />
                            </Link>
                        </div>
                    </div>
                    <div className="w-full mt-5 flex flex-col">
                        <p className="w-full text-[24px] border-b border-gray-400 pb-2">PRODUCTS</p>
                        <div className="w-full flex flex-col flex-1">
                            {products.length > 0 ? (
                                products.map((product, index) => (
                                    <ProfileProductCard
                                        key={index}
                                        product={product}
                                        productImageUrl={productImageUrls.get(product.id)}
                                        handleDelete={setSelectedProduct}
                                        isOwner={true}
                                    />
                                ))
                            ) : (
                                <p className="text-white">No products available.</p>
                            )}
                        </div>
                    </div>

                </div>
            </NavbarLayout>
        )
    }

    if (profileUser === undefined) {
        return (
            <p>Loading...</p>
        )
    }

    if (profileUser === null) {
        return (
            <p>User not found</p>
        )
    }

    return (
        <NavbarLayout>
            <div className="w-screen px-[2.5%] py-2">
                <div className="flex justify-between items-center gap-5">
                    <div className="flex gap-10">
                        <div className="size-32 rounded-full border border-gray-400 overflow-hidden flex items-end justify-center">
                            {profileUser?.image ?
                                <img className="w-full h-full object-cover" src={profileUser?.image} /> :
                                <IconPerson width="80%" height="80%"
                                />}
                        </div>
                        <div>
                            <p className="text-[32px] font-semibold">
                                {profileUser?.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex h-full gap-10">
                    </div>
                </div>
                <div className="w-full mt-5 flex flex-col">
                    <p className="w-full text-[24px] border-b border-gray-400 pb-2">PRODUCTS</p>
                    <div className="w-full flex flex-col flex-1">
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <ProfileProductCard key={index}
                                    product={product}
                                    productImageUrl={productImageUrls.get(product.id)}
                                    handleDelete={setSelectedProduct}
                                    isOwner={false}
                                />
                            ))
                        ) : (
                            <p className="text-white">No products available.</p>
                        )}
                    </div>
                </div>

            </div>
        </NavbarLayout>
    )
}

export default Profile;