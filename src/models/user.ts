import TypeUtils from "@utils/TypeUtils";

interface UserProps {
    name: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    address: string;
    image: string;
}

interface UserData {
    name: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: bigint;
    address: string;
    image: number[] | Uint8Array;
}

export default class User {
    name: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    address: string;
    image: string;

    constructor({ name, email, address, dateOfBirth, phoneNumber, image }: UserProps) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.image = image;
    }

    static castToUser(u: UserData): User {
        return new User({
            name: u.name,
            email: u.email,
            phoneNumber: u.phoneNumber,
            dateOfBirth: new Date(Number(u.dateOfBirth)),
            address: u.address,
            image: u.image.length === 0 ? "" : TypeUtils.byteArrayToImageURL(u.image),
        });
    }
}