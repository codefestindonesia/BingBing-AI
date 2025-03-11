import Result "mo:base/Result";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Products "../product/types";

module {

    public type Result<Ok, Err> = Result.Result<Ok, Err>;
    public type Product = Products.Product;
    public type HashMap<K, V> = HashMap.HashMap<K, V>;

    public type TransactionHeader = {
        id : Nat64;
        details : HashMap<Principal, [ItemDetail]>;
        date : Time.Time;
        buyer : Principal;
    };

    public type ItemDetail = {
        product : ?Product;
        quantity : Nat;
    };

    public type TransactionInput = {
        sellerPrincipal : Text;
        items : [{ productId : Nat64; quantity : Nat }];
    };

    public type SellerHistory = {
        items : [ItemDetail];
        date : Time.Time;
        buyerName : Text;
    };

    public type BuyerHistory = {
        id : Nat64;
        details : [SellerData];
        date : Time.Time;
        buyer : Text;
    };

    public type SellerData = {
        sellerName : Text;
        items : [ItemDetail];
    };

};
