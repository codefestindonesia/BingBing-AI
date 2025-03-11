interface Props {
    imageUrl: string | undefined | null;
}

const ImagePlaceholder: React.FC<Props> = ({ imageUrl }) => {
    if (imageUrl === null) {
        return <p className="w-full h-full flex items-center justify-center text-center">No image available</p>
    }
    if (imageUrl === undefined) {
        return <p className="w-full h-full flex items-center justify-center text-center">Loading...</p>
    }
    if (imageUrl) {
        return <img className="w-full h-full object-cover" src={imageUrl} alt="Product" />
    }
}

export default ImagePlaceholder;