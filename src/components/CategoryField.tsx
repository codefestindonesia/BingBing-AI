import ButtonSmall from "./ButtonSmall";
import { clothingSelections, ClothingType, Gender, genderSelection, Season, seasonSelection, typeSelection } from "@models/category";

interface Props {
    selectedGender: Gender;
    setSelectedGender: React.Dispatch<React.SetStateAction<Gender>>;
    selectedSeason: Season;
    setSelectedSeason: React.Dispatch<React.SetStateAction<Season>>;
    selectedType: ClothingType;
    setSelectedType: React.Dispatch<React.SetStateAction<ClothingType>>;
    selectedClothing: string | undefined;
    setSelectedClothing: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const CategoryField: React.FC<Props> = ({ selectedGender, setSelectedGender, selectedClothing, setSelectedClothing, selectedSeason, setSelectedSeason, selectedType, setSelectedType }) => {

    return (
        <div className="space-y-3">
            <div className="space-x-2">
                {genderSelection.map((gender, idx) => {
                    return <ButtonSmall onclick={() => { setSelectedGender(gender) }}
                        variant={selectedGender === gender ? "primary" : "secondary"}
                        key={idx} text={gender} />
                })}
            </div>

            <div className="space-x-2">
                {seasonSelection.map((season, idx) => {
                    return <ButtonSmall onclick={() => { setSelectedSeason(season) }}
                        variant={selectedSeason === season ? "primary" : "secondary"}
                        key={idx} text={season} />
                })}
            </div>

            <div className="space-x-2">
                {typeSelection.map((type, idx) => {
                    return <ButtonSmall onclick={() => {
                        setSelectedType(type)
                        setSelectedClothing(undefined)
                    }}
                        variant={selectedType === type ? "primary" : "secondary"}
                        key={idx} text={type} />
                })}
            </div>

            <div className="space-x-2">
                {clothingSelections[selectedType].map((clothing, idx) => {
                    return <ButtonSmall onclick={() => { setSelectedClothing(clothing) }}
                        variant={selectedClothing === clothing ? "primary" : "secondary"}
                        key={idx} text={clothing} />
                })}
            </div>


        </div>
    )
}

export default CategoryField;
