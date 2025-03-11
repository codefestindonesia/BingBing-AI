interface CategoryChoiceProps {
  category: string;
  setCategory: (category: string) => void;
}

const CategoryChoice: React.FC<CategoryChoiceProps> = ({
  category,
  setCategory,
}) => {
  function onClick() {
    setCategory(category);
  }
  return (
    <div className="cursor-pointer" onClick={onClick}>
      {category.toUpperCase()}
    </div>
  );
};

export default CategoryChoice;
