import Types "./types";
import TrieMap "mo:base/TrieMap";
import Nat64 "mo:base/Nat64";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import ProductActorModules "../product/interface";
import CartActorModules "../cart/interface";
import UserActorModules "../user/interface";

actor {

    public type Result<Ok, Err> = Types.Result<Ok, Err>;
    public type HashMap<K, V> = Types.HashMap<K, V>;

    public type Product = Types.Product;
    public type TransactionHeader = Types.TransactionHeader;
    public type ItemDetail = Types.ItemDetail;
    public type SellerHistory = Types.SellerHistory;
    public type SellerData = Types.SellerData;
    public type BuyerHistory = Types.BuyerHistory;
    public type TransactionInput = Types.TransactionInput;

    stable var transactionSize : Nat64 = 0;
    let transactions = TrieMap.TrieMap<Nat64, TransactionHeader>(Nat64.equal, Nat64.toNat32);

    public shared ({ caller }) func createTransaction(cartCanisterId : Text, productCanisterId : Text, transactionData : [TransactionInput]) : async Result<(), Text> {

        var TransactionDetails = HashMap.HashMap<Principal, [ItemDetail]>(0, Principal.equal, Principal.hash);

        for (data in transactionData.vals()) {
            let result = await _createTransactionDetail(cartCanisterId, productCanisterId, data, caller);
            switch (result) {
                case (#ok(res)) {
                    TransactionDetails.put(res.seller, res.details);
                };
                case (#err(err)) {
                    return #err(err);
                };
            };
        };

        let header : TransactionHeader = {
            id = transactionSize;
            details = TransactionDetails;
            date = Time.now();
            buyer = caller;
        };

        transactions.put(transactionSize, header);
        transactionSize += 1;
        return #ok(());

    };

    public shared ({ caller }) func getSellerHistory(userCanisterId : Text) : async [SellerHistory] {

        let SLTlist = Buffer.Buffer<SellerHistory>(0);
        for (transaction in transactions.vals()) {
            if (transaction.details.get(caller) != null) {
                SLTlist.add(await _createSellerHistory(userCanisterId, transaction, caller));
            };
        };

        return Buffer.toArray(SLTlist);

    };

    public shared ({ caller }) func getBuyerHistory(userCanisterId : Text) : async [BuyerHistory] {
        let histories = Buffer.Buffer<BuyerHistory>(0);

        for ((key, data) in transactions.entries()) {
            if (data.buyer == caller) {

                histories.add(await _createBuyerHistory(userCanisterId, data, caller));
            };
        };

        return Buffer.toArray(histories);
    };

    private func _createSellerHistory(userCanisterId : Text, transaction : TransactionHeader, sellerPrincipal : Principal) : async SellerHistory {
        
        let userActor = actor (userCanisterId) : UserActorModules.UserActor;
        let arrItemData = Buffer.Buffer<ItemDetail>(0);
        for ((seller, details) in transaction.details.entries()) {
            if (seller == sellerPrincipal) {
                for (detail in details.vals()) {
                    arrItemData.add(detail);
                };
            };
        };

        return {
            date = transaction.date;
            buyerName = switch(await userActor.getUser(?Principal.toText(transaction.buyer))) {
                case (#ok(user)) {
                    user.name;
                };
                case (#err(_)) {
                    "Unknown";
                };
            };
            items = Buffer.toArray(arrItemData);
        };
    };

    private func _createBuyerHistory(userCanisterId : Text, input : TransactionHeader, buyerPrincipal : Principal) : async BuyerHistory {
        
        let userActor = actor (userCanisterId) : UserActorModules.UserActor;
        let arrDetails = Buffer.Buffer<SellerData>(0);
        for ((seller, details) in input.details.entries()) {
            let data : SellerData = {
                sellerName = switch(await userActor.getUser(?Principal.toText(seller))) {
                    case (#ok(user)) {
                        user.name;
                    };
                    case (#err(_)) {
                        "Unknown";
                    };
                };
                items = details;
            };
            arrDetails.add(data);
        };
        return {
            id = input.id;
            date = input.date;
            buyer = Principal.toText(buyerPrincipal);
            details = Buffer.toArray(arrDetails);
        };
    };

    private func _createTransactionDetail(cartCanisterId : Text, productCanisterId : Text, input : TransactionInput, caller : Principal) : async Result<{ seller : Principal; details : [ItemDetail] }, Text> {
        let itemDetails = Buffer.Buffer<ItemDetail>(0);
        let productActor = actor (productCanisterId) : ProductActorModules.ProductActor;
        let cartActor = actor (cartCanisterId) : CartActorModules.CartActor;

        for (item in input.items.vals()) {
            let detail : ItemDetail = {
                product = await productActor.getProduct(item.productId, ?Principal.fromText(input.sellerPrincipal));
                quantity = item.quantity;
            };

            switch (detail.product) {
                case (?p) {
                    if (p.stock < Nat64.fromNat(detail.quantity)) {
                        return #err("Not enough stock");
                    };
                    let updatedProductStock : Product = _createUpdatedProductStock(p, Nat64.fromNat(detail.quantity));
                    let _ = await productActor.updateProductAfterTransaction(updatedProductStock);
                };
                case (null) {};
            };

            itemDetails.add(detail);
            switch (await cartActor.removeCartItem(input.sellerPrincipal, item.productId, caller)) {
                case (#ok()) {};
                case (#err(_)) {};
            };

        };

        return #ok({
            seller = Principal.fromText(input.sellerPrincipal);
            details = Buffer.toArray(itemDetails);
        });
    };

    private func _createUpdatedProductStock(p : Product, quantity : Nat64) : Product {
        return {
            id = p.id;
            name = p.name;
            price = p.price;
            stock = p.stock - quantity;
            image = p.image;
            owner = p.owner;
            gender = p.gender;
            season = p.season;
            clothingType = p.clothingType;
            clothing = p.clothing;
        };
    };
};
