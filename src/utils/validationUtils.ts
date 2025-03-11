export default class ValidationUtils {
    static isValidName(name: string): boolean {
        return name.length > 3;
    }
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email.length > 5 && emailRegex.test(email);
    }
    static isValidAddress(address: string): boolean {
        return address.length > 3;
    }
    static isValidPhoneNumber(phoneNumber: string): boolean {
        const phoneRegex = /^[0-9]{10,12}$/;
        return phoneNumber.length > 3 && phoneRegex.test(phoneNumber);
    }
}