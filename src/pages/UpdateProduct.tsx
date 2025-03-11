import IconArrowBack from "@assets/icons/IconArrowBack"
import Input from "@components/Input";
import { useEffect, useRef, useState } from "react";
import CategoryField from "@components/CategoryField";
import { Gender, genderSelection, Season, seasonSelection, ClothingType, typeSelection } from "@models/category";
import { editProductUpdate, getProductImageQuery, getProductQuery } from "@/services/productService";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@ic-reactor/react";
import Product from "@models/product";
import Swal from "sweetalert2";
import ImagePlaceholder from "@components/ImagePlaceholder";
import TypeUtils from "@utils/TypeUtils";

const UpdateProduct: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { product, getProduct, getProductLoading } = getProductQuery();
    const { getProductImage } = getProductImageQuery();
    const { identity } = useAuth();

    const [productName, setProductName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);

    const [selectedGender, setSelectedGender] = useState<Gender>(genderSelection[0]);
    const [selectedSeason, setSelectedSeason] = useState<Season>(seasonSelection[0]);
    const [selectedType, setSelectedType] = useState<ClothingType>(typeSelection[0]);
    const [selectedClothing, setSelectedClothing] = useState<string | undefined>();

    const [image, setImage] = useState<Uint8Array | undefined>();
    const [productImageUrl, setProductImageUrl] = useState<string | undefined | null>();
    const imageInput = useRef<HTMLInputElement>(null);

    const { editProduct, editProductLoading } = editProductUpdate();
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
                    setProductImageUrl(URL.createObjectURL(file));
                }
            };

            reader.readAsArrayBuffer(file);
        }
    };

    const handleSubmit = async () => {
        if(editProductLoading) return;

        if (!productName || !price || !stock || !image || image.length === 0 || !selectedClothing || !selectedGender || !selectedSeason || !selectedType) {
            setError('Please fill all fields');
            return;
        }

        try {
            setError('');
            const result = await editProduct([{
                id: BigInt(Number(id)),
                name: productName,
                price: BigInt(price),
                stock: BigInt(stock),
                image: [image],
                gender: selectedGender,
                season: selectedSeason,
                clothingType: selectedType,
                clothing: selectedClothing,
                owner: product?.owner!
            }]);
            if (result) {
                Swal.fire({
                    title: "Success!",
                    text: "The product has been successfully updated!",
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
                setProductImageUrl('');
                setError('');
                navigate(-1);
            }
        } catch (_) {
            setError('Failed to add product');
        }
    }

    async function fetchProductData() {
        const principal = identity?.getPrincipal();
        if (!principal) return;
        const product = await getProduct([BigInt(Number(id ?? '0')), [principal]]);
        if (!product || 'err' in product) {
            return
        }
        const image = await getProductImage([BigInt(Number(id ?? '0'))]);
        if (!image || image.length === 0) {
            return
        };
        setImage(new Uint8Array(image[0]));
        setProductImageUrl(TypeUtils.byteArrayToImageURL(image[0]));
    }

    async function updateFormData(product: Product) {
        setProductName(product.name);
        setPrice(product.price);
        setStock(product.stock);
        setSelectedClothing(product.clothing);
        setSelectedGender(product.gender);
        setSelectedSeason(product.season);
        setSelectedType(product.clothingType);
    }

    useEffect(() => {
        if (id) {
            fetchProductData();
        }
    }, [id])

    useEffect(() => {
        if (!product) return;
        if (product.owner !== identity?.getPrincipal().toText()) return;
        updateFormData(product);
    }, [product])

    if (getProductLoading) {
        return <div className="flex justify-center text-2xl font-semibold text-gray-700 animate-pulse mt-10">Loading...</div>
    }

    if (product === null) {
        return <div className="flex justify-center text-2xl font-semibold text-gray-700 mt-10">Product not found</div>
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
                <p className="text-3xl">Edit Product Detail</p>
            </div>

            <div className="flex">
                <div className="w-[40%] mr-10">
                    <div className="mb-5 h-full">
                        {productImageUrl === "" ?
                            <div className="flex justify-center items-center h-full border border-black">No Image</div>
                            :
                            <ImagePlaceholder imageUrl={productImageUrl} />
                        }
                    </div>
                    <button onClick={handleImage} className="w-full border-black border p-5">Edit Image</button>
                </div>

                <div className="w-full">
                    <div className="space-y-4">
                        <Input label="Product Name" data={productName} inputOnChange={(e) => { setProductName(e.target.value) }} />
                        <Input label="Price" data={price} inputOnChange={(e) => setPrice(Number(e.target.value))} />
                        <Input label="Stock" data={stock} inputOnChange={(e) => setStock(Number(e.target.value))} />
                        <div>
                            <label>Category</label>
                            <CategoryField selectedClothing={selectedClothing} selectedGender={selectedGender} selectedSeason={selectedSeason} selectedType={selectedType}
                                setSelectedClothing={setSelectedClothing} setSelectedGender={setSelectedGender} setSelectedSeason={setSelectedSeason} setSelectedType={setSelectedType}
                            />
                        </div>
                    </div>

                    <p className="text-sm text-red-500 mt-3">{error}</p>

                    {editProductLoading ?
                        <button className="w-full mt-3 p-4 bg-gray-400 text-white font-bold">Loading...</button>
                        :
                        <button onClick={handleSubmit} className="w-full mt-3 p-4 bg-black border-black border text-white">Update Product</button>
                    }
                </div>
            </div>
            <input
                onChange={handleImageChange}
                className="hidden"
                type="file"
                ref={imageInput}
            />
        </div>
    )
}

export default UpdateProduct;