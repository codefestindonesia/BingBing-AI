import { editUserUpdate } from "@/services/userService";
import IconPerson from "@assets/icons/IconPerson";
import ButtonSmall from "@components/ButtonSmall";
import EditProfileInput from "@components/EditProfileInput";
import useAuthContext from "@hooks/useAuthContext";
import NavbarLayout from "@layouts/NavbarLayout";
import TypeUtils from "@utils/TypeUtils";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdateProfile: React.FC = () => {
    const navigate = useNavigate();
    const { user, fetchUser } = useAuthContext();

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [address, setAddress] = useState<string>('');

    const [image, setImage] = useState<Uint8Array>();
    const [imageUrl, setImageUrl] = useState<string>('');
    const imageInput = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string>('');

    const { editUser } = editUserUpdate();

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

    const updateFormData = async () => {
        if (!user) return;
        setName(user.name);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber);
        setAddress(user.address);
        setImage(await TypeUtils.fetchUint8ArrayFromUrl(user.image) ?? new Uint8Array());
        setImageUrl(user.image);
    }

    const handleSubmit = async () => {
        if (!name || !email || !phoneNumber || !address) {
            setError("Please fill in all fields");
            return;
        }

        const result = await editUser([{ name, email, phoneNumber, dateOfBirth: BigInt(user?.dateOfBirth.getTime()!), address, image: image || new Uint8Array }]);
        if (result && !('err' in result)) {
            await fetchUser();
            navigate(-1);
        } else {
            setError("Failed to update profile");
        }
    }

    useEffect(() => {
        updateFormData();
    }, [user])


    return (
        <NavbarLayout>
            <div className="flex w-[80%] px-16 py-8 justify-center gap-16">
                <div className="flex flex-col items-center gap-8">
                    <div className="h-[200px] w-[200px] rounded-full flex overflow-hidden border border-black justify-center items-end">
                        {imageUrl ? <img className="w-full h-full object-cover" src={imageUrl} alt="" /> : <IconPerson width="80%" height="80%" />}
                    </div>
                    <button onClick={(e) => handleImage(e)} className="text-gray-500 text-md">Edit Profile Image</button>
                </div>
                <div className="w-full">

                    <div className="flex flex-col w-full gap-8">
                        <EditProfileInput label="First Name" data={name} inputOnChange={(e) => { setName(e.target.value) }} />
                        <EditProfileInput label="Email" data={email} inputOnChange={(e) => { setEmail(e.target.value) }} />
                        <EditProfileInput label="Phone Number" data={phoneNumber} inputOnChange={(e) => { setPhoneNumber(e.target.value) }} />
                        <EditProfileInput label="Address" data={address} inputOnChange={(e) => { setAddress(e.target.value) }} />
                    </div>
                    <p className="mt-5 min-h-4 text-sm text-red-500">{error}</p>
                    <div className="flex gap-8 mt-5 w-full justify-center">
                        <ButtonSmall onclick={() => navigate(-1)} text="Back to Profile" variant="secondary" />
                        <ButtonSmall onclick={handleSubmit} text="Save Changes" />
                    </div>
                </div>
            </div>
            <input className="hidden" onChange={handleImageChange} type="file" ref={imageInput} accept="image/*" />

        </NavbarLayout>
    )
}

export default UpdateProfile;