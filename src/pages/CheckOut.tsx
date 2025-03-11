import { burnUpdate, transferUpdate } from "@/services/tokenService";
import { createTransactionUpdate } from "@/services/transactionService";
import IconWallet from "@assets/icons/IconWallet";
import Card from "@components/Card";
import useAuthContext from "@hooks/useAuthContext";
import useServiceContext from "@hooks/useServiceContext";
import NavbarLayout from "@layouts/NavbarLayout";
import { Transaction } from "@models/transaction";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { productCanisterId, cartCanisterId } = useServiceContext();
    const { user, balance, fetchUser } = useAuthContext();

    const [transaction, setTransaction] = useState<Transaction[]>([]);
    const [imageUrls, setImageUrls] = useState<Map<number, string>>(new Map());
    const [totalPrice, setTotalPrice] = useState(0);
    const shippingFee = 10000;
    const serviceFee = 1000;

    const { createTransaction, createTransactionLoading } = createTransactionUpdate();
    const { transfer, transferLoading } = transferUpdate();
    const { burn, burnLoading } = burnUpdate();

    async function handleCreateTransaction() {
        const tran = transaction.map(t => {
            return {
                sellerPrincipal: t.items[0].product.owner,
                items: t.items.map(i => {
                    return {
                        productId: BigInt(i.product.id),
                        quantity: BigInt(i.quantity)
                    }
                })
            }
        });

        const res = await createTransaction([cartCanisterId, productCanisterId, tran]);

        if (!res || 'err' in res) {
            Swal.fire(
                'Error', 
                res && 'err' in res ? res.err : 'Failed to create transaction', 
                'error'
            );
            return;
        }

        if(balance < totalPrice + shippingFee) {
            Swal.fire('Error', 'BingPay balance is not enough', 'error');
            return;
        }

        await Promise.all(transaction.map(t => {
            const to = t.items[0].product.owner;
            const amount = t.items.reduce((acc, curr) => {
                return acc + curr.product.price * Number(curr.quantity);
            }, 0)
            return transfer([to, BigInt(amount)]);
        }))

        await burn([BigInt(shippingFee)]);
        await fetchUser();

        Swal.fire('Success', 'Transaction has been created', 'success');
        setTransaction([]);
        setImageUrls(new Map());
        navigate('/');
    };

    useEffect(() => {
        setTransaction(location.state.transaction as Transaction[]);
        setImageUrls(location.state.imageUrls as Map<number, string>);
    }, [])

    useEffect(() => {
        if (!transaction) return;

        const totalPrice = transaction.reduce((acc, curr) => {
            return acc + curr.items.reduce((acc, curr) => {
                return acc + curr.product.price * Number(curr.quantity);
            }, 0);
        }, 0);

        setTotalPrice(totalPrice);
    }, [transaction])

    if (!transaction || transaction.length === 0) {
        return <NavbarLayout>
            <div className="flex flex-col justify-center items-center">
                <p className="text-2xl font-semibold">No Items in Cart</p>
                <button className="text-xl font-semibold"
                    onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        </NavbarLayout>
    }

    return (
        <NavbarLayout>
            <p className="self-start px-20 text-3xl font-medium">Order</p>

            <div className="flex w-full py-5 px-20 justify-between">
                <div className="w-full mr-10">
                    <div className="bg-[#FFFDFD] space-y-2 mb-5 px-5 py-2 border-gray-200 border">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">SHIPPING DETAIL</p>
                        </div>

                        <div>
                            <p className="font-bold text-sm">{user?.name}</p>
                            <p className="text-sm">{user?.phoneNumber}</p>
                        </div>

                        <div>
                            <p className="text-sm">{user?.address}</p>
                        </div>
                    </div>

                    {transaction.map((t, index) => {
                        return <Card imageUrls={imageUrls} transaction={t} key={index} />
                    })}
                </div>

                <div className="bg-[#FFFDFD] w-[50%] h-fit p-5 border-gray-200 border">
                    <p className="mb-5 font-bold text-2xl">Payment Summary</p>

                    <div className="flex justify-between mb-3">
                        <p className="text-lg">Subtotal</p>
                        <p className="text-lg">{totalPrice.toLocaleString()}</p>
                    </div>

                    <div className="flex justify-between mb-2">
                        <p className="text-lg">Shipping Fee</p>
                        <p className="text-lg">{shippingFee.toLocaleString()}</p>
                    </div>

                    <div className="flex justify-between mb-2">
                        <p className="text-lg">Service Fee</p>
                        <p className="text-lg">{serviceFee.toLocaleString()}</p>
                    </div>

                    <hr className="border-black mb-2" />

                    <div className="flex justify-between mb-7">
                        <p className="text-lg">Total</p>
                        <p className="text-xl font-bold">{(totalPrice + shippingFee + serviceFee).toLocaleString()}</p>
                    </div>

                    <div className="flex bg-white justify-between items-center border border-gray-200 rounded-md p-2 mb-2">
                        <div className="flex items-center">
                            <div className="w-10 h-10">
                                <IconWallet />
                            </div>
                            <p>BingPay</p>
                        </div>

                        <p className="font-bold">{balance.toLocaleString()}</p>
                    </div>

                    <p className="mb-2 italic text-xs text-red-500 min-h-4">
                        {balance < totalPrice + shippingFee + serviceFee && "*BingPay balance is not enough"}
                    </p>

                    {createTransactionLoading || transferLoading || burnLoading ?
                        <button className="w-full p-3 bg-gray-500 text-white font-bold rounded">
                            Loading...
                        </button> :
                        <button onClick={handleCreateTransaction}
                            className="w-full p-3 bg-black text-white font-bold rounded">
                            Check Out
                        </button>
                    }
                </div>
            </div>

        </NavbarLayout>
    )
}

export default Checkout;