import Product from "@models/product";
import ButtonSmall from "./ButtonSmall";
import { Link } from "react-router-dom";
import ImagePlaceholder from "./ImagePlaceholder";

interface Props {
    product: Product;
    productImageUrl: string | undefined | null;
    handleDelete: (product: Product) => void;
    isOwner: boolean;
}

const ProfileProductCard: React.FC<Props> = ({ product, productImageUrl, handleDelete, isOwner }) => {
    return (
        <div className="w-full flex p-4 shadow-md mb-4  gap-x-8">
            <Link to={`/productDetail/${product.id}`}>
                <div className="w-[200px] h-[200px] flex-shrink-0 cursor-pointer">
                    <ImagePlaceholder imageUrl={productImageUrl} />
                </div>
            </Link>
            <div className="flex flex-col p-4 justify-between w-full">
                <div>
                    <div className="flex justify-between">
                        <p className="text-lg font-bold">{product.name}</p>
                        <p className="italic">Stock: {product.stock}</p>
                    </div>
                    <p className="text-md text-gray-600">IDR {product.formatPrice()}</p>
                </div>
                {isOwner && <div className="flex gap-2">
                    <Link to={`/editProduct/${product.id}`}>
                        <ButtonSmall text="EDIT" variant="secondary" />
                    </Link>
                    <ButtonSmall onclick={() => handleDelete(product)} text="DELETE" />
                </div>}
            </div>
        </div>
    );
};

export default ProfileProductCard;
