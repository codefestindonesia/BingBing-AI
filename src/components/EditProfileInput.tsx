interface Props {
    label: string;
    data: string | number;
    inputOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditProfileInput: React.FC<Props> = ({ label, data, inputOnChange }) => {
    return (
        <div className="flex flex-col w-full">
            <label className="text-gray-500 text-md">{label}</label>
            <input
                className="border-b border-b-black p-2 w-full"
                value={data}
                onChange={inputOnChange}
            />
        </div>
    )
}

export default EditProfileInput;