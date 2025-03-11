import ImagePlaceholder from "./ImagePlaceholder";

interface Props {
    imageUrl: string | undefined | null;
    children?: React.ReactNode;
    className?: string | undefined;
}

const ProductInfoCard: React.FC<Props> = ({ imageUrl, children, className }) => {
    return (
        <div className={`flex w-full ${className}`}>
            <div className="w-[12.5vw] h-[25vh] max-w-60 max-h-96 mr-8">
                <ImagePlaceholder imageUrl={imageUrl} />
            </div>
            {children}
        </div>
    )
} 

export default ProductInfoCard;