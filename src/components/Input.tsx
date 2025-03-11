interface Props {
    label: string;
    data: string | number;
    inputOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<Props> = ({ label, data, inputOnChange }) => {
    const inputType = typeof data === 'number' ? 'number' : 'text';

    return (
        <div>
            <label>{label}</label>
            <input 
                type={inputType} 
                value={data} 
                onChange={inputOnChange} 
                className="w-full p-3 border-black border" 
            />
        </div>
    );
}

export default Input;
