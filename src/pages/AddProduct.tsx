import Input from "@components/Input";
import { useEffect, useRef, useState } from "react";
import CategoryField from "@components/CategoryField";
import IconArrowBack from "@assets/icons/IconArrowBack";
import { ClothingType, Gender, genderSelection, Season, seasonSelection, typeSelection } from "@models/category";
import { createProductUpdate } from "@/services/productService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddProduct: React.FC = () => {
    const navigate = useNavigate();
    const [productName, setProductName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);
    const [image, setImage] = useState<Uint8Array>(new Uint8Array());

    const [selectedGender, setSelectedGender] = useState<Gender>(genderSelection[0]);
    const [selectedSeason, setSelectedSeason] = useState<Season>(seasonSelection[0]);
    const [selectedType, setSelectedType] = useState<ClothingType>(typeSelection[0]);
    const [selectedClothing, setSelectedClothing] = useState<string | undefined>();

    const [imageUrl, setImageUrl] = useState<string>("");
    const imageInput = useRef<HTMLInputElement>(null);
    const { createProduct, createProductLoading } = createProductUpdate();

    const [error, setError] = useState<string>('');

    const handleImage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (imageInput.current) {
            imageInput.current.click();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.result) {
                    const arrayBuffer = reader.result as ArrayBuffer;
                    const uint8Array = new Uint8Array(arrayBuffer);
                    setImage(uint8Array);
                    setImageUrl(URL.createObjectURL(file));
                }
            };

            reader.readAsArrayBuffer(file);
        }
    };

    const handleSubmit = async () => {
        if (createProductLoading) return;

        if (!productName || !price || !stock || image.length === 0 || !selectedClothing || !selectedGender || !selectedSeason || !selectedType) {
            setError('Please fill all fields');
            return;
        }

        try {
            const result = await createProduct([productName, BigInt(price), BigInt(stock), image, selectedGender, selectedSeason, selectedType, selectedClothing!]);
            console.log(result);
            if (!result) {
                setError('Failed to add product');
                return;
            }
            if ('err' in result) {
                setError(result.err);
                return;
            }

            Swal.fire({
                title: "Success!",
                text: "The product was successfully added!",
                icon: "success"
            })

            setProductName('');
            setPrice(0);
            setStock(0);
            setImage(new Uint8Array());
            setSelectedClothing(undefined);
            setSelectedGender(genderSelection[0]);
            setSelectedSeason(seasonSelection[0]);
            setSelectedType(typeSelection[0]);
            setImageUrl('');
            setError('');
            navigate(-1);
        } catch (_) {
            setError('Failed to add product');
        }
    }

    return (
        <div className="my-10 mx-20">
            <div className="flex flex-row items-center mb-10">
                <div className="mr-5">
                    <button className="flex size-6 cursor-pointer items-center justify-center"
                        onClick={() => navigate(-1)}>
                        <IconArrowBack />
                    </button>
                </div>
                <p className="text-3xl">Add Product</p>
            </div>

            <div className="flex">
                <div className="w-[40%] mr-10">
                    <div className="mb-5 h-full">
                        {imageUrl === "" ?
                            <div className="flex justify-center items-center h-full border border-black">No Image</div>
                            :
                            <img src={imageUrl} alt="Product" className="h-full object-cover" />
                        }
                    </div>
                    <button onClick={handleImage} className="w-full border-black border p-5">Add Image</button>
                </div>

                <div className="w-full">
                    <div className="space-y-4">
                        <Input label="Product Name" data={productName} inputOnChange={(e) => setProductName(e.target.value)} />
                        <Input label="Price" data={price} inputOnChange={(e) => setPrice(Number(e.target.value))} />
                        <Input label="Stock" data={stock} inputOnChange={(e) => setStock(Number(e.target.value))} />
                        <div>
                            <label>Category</label>
                            <CategoryField selectedClothing={selectedClothing} selectedGender={selectedGender} selectedSeason={selectedSeason} selectedType={selectedType}
                                setSelectedClothing={setSelectedClothing} setSelectedGender={setSelectedGender} setSelectedSeason={setSelectedSeason} setSelectedType={setSelectedType}
                            />
                        </div>
                    </div>

                    <p className="text-xs min-h-4 text-red-500 mt-3">{error}</p>

                    {createProductLoading ?
                        <button className="w-full mt-3 p-4 bg-gray-400 text-white font-bold">Loading...</button>
                        :
                        <button onClick={handleSubmit} className="w-full mt-3 p-4 bg-black border-black border text-white">Add Product</button>
                    }
                </div>
            </div>
            <input className="hidden" onChange={handleImageChange} type="file" ref={imageInput} accept="image/*" />
        </div>
    );
};

export default AddProduct;
