interface Props {
    quantity: number;
    updateCartQuantity: (quantity: number) => void;
}

const InputNumber: React.FC<Props> = ({ quantity, updateCartQuantity }) => {
    return (
        <div className="flex justify-between items-center border-black border rounded">
            <button
                onClick={() => updateCartQuantity(quantity - 1)}
                className="w-10 h-10 bg-black text-white cursor-pointer border-r text-xl font-bold hover:bg-white hover:text-black active:text-white">
                -
            </button>

            <input type="number" value={quantity} min={1} onChange={(e) => updateCartQuantity(Number(e.target.value))} className="w-14 h-10 text-center text-sm appearance-none focus:outline-none no-spin flex items-center justify-center no-spin" />

            <button onClick={() => updateCartQuantity(quantity + 1)}
                className="w-10 h-10 bg-black text-white cursor-pointer border-l text-xl font-bold hover:bg-white hover:text-black active:text-white">
                +
            </button>
        </div>
    )
}

export default InputNumber;