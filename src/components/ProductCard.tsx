import Product from '@models/product';
import { Link } from 'react-router-dom';
import ImagePlaceholder from './ImagePlaceholder';

interface Props {
    product: Product;
    imageUrl: string | undefined | null;
}

const ProductCard: React.FC<Props> = ({ product, imageUrl }) => {
    return (
        <div className="flex h-[45vh] w-[15vw] flex-col items-center overflow-hidden rounded-2xl shadow-[0_4px_6px_rgba(0,0,0,0.1)] z-0">
            <div className="relative flex-1 w-full max-h-[85%]">
                <Link to={`/productDetail/${product.id}`}>
                    <ImagePlaceholder imageUrl={imageUrl} />
                </Link>
            </div>
            <div className="flex flex-col justify-evenly p-[5%] w-full">
                <p className="font-bold">{product?.name}</p>
                <p className="text-sm">IDR {product?.formatPrice()}</p>
            </div>
        </div>
    );
};


export default ProductCard;
