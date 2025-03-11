import Types "types";
module {
    type Product = Types.Product;
    public func _createProduct(
        _id : Nat64,
        _name : Text,
        _price : Nat64,
        _stock : Nat64,
        _image : Blob,
        _owner : Text,
        _gender : Text,
        _season : Text,
        _clothingType : Text,
        _clothing : Text,
    ) : Product {
        return {
            id = _id;
            name = _name;
            price = _price;
            stock = _stock;
            image = ?_image;
            owner = _owner;
            gender = _gender;
            season = _season;
            clothingType = _clothingType;
            clothing = _clothing;
        };
    };
};
