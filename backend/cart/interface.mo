import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import ProductTypes "../product/types";
import Types "./types";

module {

    type Result<Ok, Error> = Result.Result<Ok, Error>;
    type Product = ProductTypes.Product;
    type ShownCart = Types.ShownCart;

    public type CartActor = actor {
        createCart : (user : Principal) -> ();
        addOrUpdateCart : (sellerId : Text, product : Product, quantity : Nat) -> async Result<(), Text>;
        removeCartItem : (sellerId : Text, productId : Nat64, caller: Principal) -> async Result<(), Text>;
        getSelfCart : () -> async Result<[ShownCart], Text>;
        removeNoProductCart: (sellerId : Principal, productId : Nat64) -> ();
    };
};
