interface Props {
    category: string;
}

const CategoryBubble: React.FC<Props> = ({ category }) => {
    return (
        <div className="px-2 rounded-2xl border border-gray-600 w-24 flex justify-center">
            <p className="text-sm font-light">
                {category}
            </p>
        </div>
    )
}

export default CategoryBubble;