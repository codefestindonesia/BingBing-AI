import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Products "../product/types";

module {

    public type Product = Products.Product;
    public type Result<Ok, Err> = Result.Result<Ok, Err>;
    public type ProductWithoutImage = Products.ProductWithoutImage;
    public type HashMap<K, V> = HashMap.HashMap<K, V>;
    public type Buffer<T> = Buffer.Buffer<T>;

    public type CartDetail = {
        productId : Nat64;
        quantity : Nat;
    };

    public type ShownCartDetail = {
        product : ?ProductWithoutImage;
        quantity : Nat;
    };

    public type ShownCart = {
        ownerName : Text;
        products : [ShownCartDetail];
    };

};
