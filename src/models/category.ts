export const genderSelection = [
    "Men",
    "Women"
] as const;

export const seasonSelection = [
    "Summer",
    "Fall",
    "Spring",
    "Winter"
] as const;

export const typeSelection = [
    "Tops",
    "Bottoms",
    "Outerwear",
    "Accessories"
] as const;

const topSelection = [
    "T-Shirt",
    "Shirt",
    "Long Sleeve",
    "Short Sleeve"
] as const;

const bottomSelection = [
    "Pants",
    "Short",
    "Skirt"
] as const;

const outerwearSelection = [
    "Coat",
    "Cardigan"
] as const;

const accessoriesSelection = [
    "Hat",
    "Glasses",
    "Watch"
] as const;

export type Gender = typeof genderSelection[number];
export type Season = typeof seasonSelection[number];
export type ClothingType = typeof typeSelection[number];
type Tops = typeof topSelection[number];
type Bottoms = typeof bottomSelection[number];
type Outerwear = typeof outerwearSelection[number];
type Accessories = typeof accessoriesSelection[number];

type ClothingSelections = {
    Tops: ReadonlyArray<Tops>,
    Bottoms: ReadonlyArray<Bottoms>,
    Outerwear: ReadonlyArray<Outerwear>,
    Accessories: ReadonlyArray<Accessories>
};

export const clothingSelections: ClothingSelections = {
    "Tops": topSelection,
    "Bottoms": bottomSelection,
    "Outerwear": outerwearSelection,
    "Accessories": accessoriesSelection
}