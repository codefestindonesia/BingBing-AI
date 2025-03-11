import Product, { ProductData } from "./product";

interface CartDetails {
    product: Product | null;
    quantity: number;
}

interface CartProps {
    ownerName: string;
    products: CartDetails[];
}

interface CartDetailData {
    product: [ProductData] | [];
    quantity: bigint;
}

interface CartData {
    ownerName: string;
    products: CartDetailData[];
}

export default class Cart {
    ownerName: string;
    cartDetails: CartDetails[];

    constructor({ ownerName, products }: CartProps) {
        this.ownerName = ownerName;
        this.cartDetails = products;
    };

    static fromCartData(u: CartData): Cart {
        return new Cart({
            ownerName: u.ownerName,
            products: u.products.map(p => {
                if (p.product) {
                    return {
                        product: p.product.length === 0 ? null : Product.fromProductData(p.product[0]),
                        quantity: Number(p.quantity)
                    } as CartDetails;
                }
                return {
                    product: null,
                    quantity: Number(p.quantity)
                } as CartDetails;
            })
        });
    };
}