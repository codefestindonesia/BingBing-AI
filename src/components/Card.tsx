import { Transaction } from "@models/transaction";
import ImagePlaceholder from "./ImagePlaceholder";

interface Props {
    transaction: Transaction;
    imageUrls: Map<number, string>;
}

const Card: React.FC<Props> = ({ transaction, imageUrls }) => {
    const subTotal = transaction.items.reduce((acc, curr) => {
        return acc + curr.product.price * Number(curr.quantity);
    }, 0);

    return (
        <>
            <div className="flex bg-[#FFFDFD] border border-gray-200 px-5 py-2">
                <div className="flex justify-between w-full">
                    <p className="font-medium">{transaction.ownerName}</p>
                    <p className="font-bold">IDR. {subTotal.toLocaleString()}</p>
                </div>
            </div>

            {transaction.items.map((item, index) => {
                const product = item.product;
                return <div className="flex bg-[#FFFDFD] border border-gray-200 px-5 py-2" key={index}>
                    <div className="flex w-full py-3">
                        <div className="w-[12.5vw] h-[25vh] max-w-60 max-h-96 mr-8">
                            <ImagePlaceholder imageUrl={imageUrls.get(item.product.id)} />
                        </div>

                        <div className="flex flex-col justify-between w-full">
                            <p>{product.name}</p>
                            <div className="w-full flex justify-between">
                                <p className="font-bold">IDR. {product.price.toLocaleString()}</p>
                                <p>qty: {Number(item.quantity)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            })}
        </>
    )
}

export default Card;