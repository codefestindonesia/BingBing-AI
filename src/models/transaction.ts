import Product, { ProductData } from "./product";

interface TransactionDetail {
    product: Product;
    quantity: number;
}

interface TransactionProps {
    id: number;
    details: TransactionDetail[];
    date: Date;
    seller: string;
    buyer: string;
}

interface TransactionDetailData {
    product: ProductData;
    quantity: bigint;
}

interface TransactionHeaderData {
    id: bigint;
    details: TransactionDetailData[];
    date: bigint;
    seller: string;
    buyer: string;
}

class TransactionHeader {
    id: number;
    details: TransactionDetail[];
    date: Date;
    seller: string;
    buyer: string;

    constructor({ id, details, date, seller, buyer }: TransactionProps) {
        this.id = id;
        this.details = details;
        this.date = date;
        this.seller = seller;
        this.buyer = buyer;
    }

    static castToTransaction(t: TransactionHeaderData): TransactionHeader {
        return new TransactionHeader({
            id: Number(t.id),
            details: t.details.map((d) => {
                return {
                    product: Product.fromProductData(d.product),
                    quantity: Number(d.quantity)
                };
            }),
            date: new Date(Number(t.date)),
            seller: t.seller,
            buyer: t.buyer
        });
    }
}

interface TransactionItem {
    product: Product;
    quantity: bigint;
};

interface Transaction {
    ownerName: string;
    items: TransactionItem[];
}

export default TransactionHeader;
export type { TransactionItem, Transaction, TransactionDetail };