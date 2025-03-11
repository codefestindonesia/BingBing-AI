import Result "mo:base/Result";
import Nat64 "mo:base/Nat64";

module {
    public type Result<Ok, Err> = Result.Result<Ok, Err>;
    public type Product = {
        id : Nat64;
        name : Text;
        price : Nat64;
        stock : Nat64;
        image : ?Blob;
        owner : Text;
        gender : Text;
        season : Text;
        clothingType : Text;
        clothing : Text;
    };

    public type ProductWithoutImage = {
        id : Nat64;
        name : Text;
        price : Nat64;
        stock : Nat64;
        owner : Text;

        gender : Text;
        season : Text;
        clothingType : Text;
        clothing : Text;
    };
};
