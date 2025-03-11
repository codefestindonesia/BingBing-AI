import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Nat64 "mo:base/Nat64";
import Products "../product/types";
import Types "./types";
import ProductActorModules "../product/interface";
import UserActorModules "../user/interface";

actor {

    type Result<Ok, Error> = Types.Result<Ok, Error>;
    type HashMap<K, V> = Types.HashMap<K, V>;
    type Buffer<T> = Types.Buffer<T>;
    type Product = Products.Product;

    type CartDetail = Types.CartDetail;
    type ShownCart = Types.ShownCart;
    type ShownCartDetail = Types.ShownCartDetail;
    type UserCartDetail = HashMap<Nat64, Nat>;
    type UserCartItem = HashMap<Principal, UserCartDetail>;

    let carts = HashMap.HashMap<Principal, UserCartItem>(0, Principal.equal, Principal.hash);

    public shared func createCart(user : Principal) : () {
        carts.put(user, HashMap.HashMap<Principal, UserCartDetail>(0, Principal.equal, Principal.hash));
        return ();
    };

    public shared ({ caller }) func addOrUpdateCart(sellerId : Text, productId : Nat64, quantity : Nat) : async Result<(), Text> {
        let ownerCart = switch (carts.get(caller)) {
            case (null) { return #err("Cart not found") };
            case (?cart) { cart };
        };

        if (caller == Principal.fromText(sellerId)) {
            return #err("You can't add your own product to cart");
        };

        switch (ownerCart.get(Principal.fromText(sellerId))) {
            case (null) {
                let newCartItem = _produceCartItem(productId, quantity);
                ownerCart.put(Principal.fromText(sellerId), newCartItem);
                return #ok(());
            };
            case (?cartItem) {
                switch (cartItem.get(productId)) {
                    case (null) {
                        cartItem.put(productId, quantity);
                        return #ok(());
                    };
                    case (?existingQuantity) {
                        cartItem.put(productId, existingQuantity + quantity);
                        return #ok(());
                    };
                };
                return #ok(());
            };
        };

    };

    public shared ({ caller }) func removeSelfCartItem(sellerId : Text, productId : Nat64) : async Result<(), Text> {
        let ownerCart = switch (carts.get(caller)) {
            case (null) { return #err("Cart not found") };
            case (?cart) { cart };
        };

        switch (ownerCart.get(Principal.fromText(sellerId))) {
            case (null) {
                return #err("Cart Item not found");
            };
            case (?cartItem) {
                cartItem.delete(productId);
                if (cartItem.size() == 0) {
                    ownerCart.delete(Principal.fromText(sellerId));
                };
                return #ok(());
            };
        };
    };

    public shared func removeCartItem(sellerId : Text, productId : Nat64, caller : Principal) : async Result<(), Text> {
        let ownerCart = switch (carts.get(caller)) {
            case (null) { return #err("Cart not found") };
            case (?cart) { cart };
        };

        switch (ownerCart.get(Principal.fromText(sellerId))) {
            case (null) {
                return #err("Cart Item not found");
            };
            case (?cartItem) {
                cartItem.delete(productId);
                if (cartItem.size() == 0) {
                    ownerCart.delete(Principal.fromText(sellerId));
                };
                return #ok(());
            };
        };
    };

    public shared func removeNoProductCart(sellerId : Principal, productId : Nat64) : () {
        for (ownerCart in carts.vals()) {
            switch (ownerCart.get(sellerId)) {
                case (null) {};
                case (?cartItem) {
                    if (cartItem.get(productId) != null) {
                        ownerCart.delete(sellerId);
                    };
                };
            };
        };
    };

    public shared ({ caller }) func getSelfCart(productCanisterId : Text, userCanisterId : Text) : async Result<[ShownCart], Text> {
        let productActor = actor (productCanisterId) : ProductActorModules.ProductActor;
        let userActor = actor (userCanisterId) : UserActorModules.UserActor;
        switch (carts.get(caller)) {
            case (null) {
                return #err("Empty Cart");
            };
            case (?cart) {
                let shownCart = Buffer.Buffer<ShownCart>(0);
                for ((ownerId, products) in cart.entries()) {
                    var itemList = Buffer.Buffer<ShownCartDetail>(0);

                    for ((productId, quantity) in products.entries()) {
                        let detail = {
                            product = await productActor.getProduct(productId, null);
                            quantity = quantity;
                        };
                        itemList.add(detail);
                    };
                    let user = switch (await userActor.getUser(?Principal.toText(ownerId))) {
                        case (#ok(user)) { user };
                        case (#err(_)) { return #err("User not found") };
                    };
                    shownCart.add({
                        ownerName = user.name;
                        products = Buffer.toArray(itemList);
                    });

                };
                return #ok(Buffer.toArray(shownCart));
            };
        };
    };

    private func _produceCartDetail(product : Product, quantity : Nat) : CartDetail {
        return {
            productId = product.id;
            quantity = quantity;
        };
    };

    private func _produceCartItem(protuctId : Nat64, quantity : Nat) : HashMap<Nat64, Nat> {
        let cartItem = HashMap.HashMap<Nat64, Nat>(0, Nat64.equal, Nat64.toNat32);
        cartItem.put(protuctId, quantity);
        return cartItem;
    };

};
