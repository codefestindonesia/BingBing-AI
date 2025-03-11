import Product from "@models/product";
import Modal from "./Modal";
import ButtonSmall from "./ButtonSmall";

interface Props {
    product: Product;
    onClose: () => void;
    handleDeleteProduct: () => void;
    isLoading: boolean;
}

const DeleteProductModal: React.FC<Props> = ({ product, onClose, handleDeleteProduct, isLoading }) => {
    return (
        <Modal onClose={onClose}>
            <div className="flex flex-col h-[25vh] w-[25vw]">
                <p className="font-semibold text-[32px] mb-4">Delete Product</p>
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <p>Are you sure to delete this product?</p>
                        <p>This action can't be undone.</p>
                    </div>
                    <div className="flex gap-4 w-full justify-end">
                        <ButtonSmall onclick={onClose} text="No" />
                        {isLoading ?
                            <ButtonSmall text="Loading..." variant="secondary" /> :
                            <ButtonSmall onclick={handleDeleteProduct} text="Yes" variant="secondary" />
                        }
                    </div>
                </div>
            </div>
        </Modal>
    )

}
export default DeleteProductModal;