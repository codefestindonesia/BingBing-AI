interface Props {
    text: string;
    onclick?: () => void;
    variant?: 'primary' | 'secondary';
    buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

const ButtonSmall: React.FC<Props> = ({ text, onclick, variant = 'primary', buttonProps }) => {
    if (variant === 'primary') {
        return (
            <button
                className="bg-black text-white px-4 py-1 rounded-sm w-36 hover:bg-opacity-80"
                onClick={onclick}
                {...buttonProps}
            >
                {text}
            </button>
        );
    }
    return (
        <button
            className="bg-white text-black px-4 py-1 border border-black rounded-sm w-36 hover:bg-gray-100"
            onClick={onclick}
            {...buttonProps}
        >
            {text}
        </button>
    );
}

export default ButtonSmall;