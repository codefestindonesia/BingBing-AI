import CategoryChoice from './CategoryChoice';

interface Props {
  category: string;
  setCategory: (category: string) => void;
}

const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Men', 'Women', 'Accessories'];

const CategoryBar: React.FC<Props> = ({ category, setCategory }) => {
  return (
    <div className="sticky top-12 flex w-[50%] justify-evenly py-[10px] items-center z-50">
      {categories.map((category, idx) => {
        return (
          <CategoryChoice
            category={category}
            key={idx}
            setCategory={setCategory}
          />
        );
      })}
    </div>
  );
};

export default CategoryBar;
