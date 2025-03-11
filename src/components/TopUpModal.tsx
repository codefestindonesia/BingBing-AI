import Modal from "./Modal";
import ButtonSmall from "./ButtonSmall";

interface Props {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    handleTopUp: () => Promise<void>;
    isLoading: boolean;
}

const TopUpModal: React.FC<Props> = ({ value, onChange, onClose, handleTopUp, isLoading }) => {
    return (
        <Modal onClose={onClose}>
            <div className="flex flex-col h-[35vh] w-[25vw]">
                <p className="font-semibold text-[32px]">Top Up</p>
                <div className="flex flex-col justify-between h-full">
                    <div className="p-4">
                        <p>Top Up Amount:</p>
                        <input className="w-full border border-gray-400 rounded-md p-2 mt-2"
                            type="number" value={value} onChange={onChange}
                        />
                    </div>
                    <div className="flex gap-4 w-full justify-end">
                        <ButtonSmall onclick={onClose} text="No" />
                        {isLoading ?
                            <ButtonSmall text="Loading..." variant="secondary" /> :
                            <ButtonSmall onclick={handleTopUp} text="Yes" variant="secondary" />
                        }
                    </div>
                </div>
            </div>
        </Modal>
    )

}
export default TopUpModal;