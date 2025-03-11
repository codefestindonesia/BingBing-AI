import Result "mo:base/Result";
import Types "./types";

module {

    type Result<Ok, Error> = Result.Result<Ok, Error>;
    type Product = Types.Product;

    public type ProductActor = actor {
        getProduct : (key : Nat64, owner : ?Principal) -> async ?Product;
        updateProductAfterTransaction(product : Product) : async Result<(), Text>;
    };
};
