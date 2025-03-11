import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import ProductActorModules "../product/interface";
import Types "types";

actor {

    type Result<Ok, Error> = Result.Result<Ok, Error>;
    type ProductWithoutImage = Types.ProductWithoutImage;

    let favorites = HashMap.HashMap<Principal, Buffer.Buffer<Nat64>>(0, Principal.equal, Principal.hash);

    public shared func createFavoriteList(user : Principal) : async Result<(), Text> {

        if (Principal.toText(user) == "2vxsx-fae") {
            return #err("Anonymous user cannot create a favorite list");
        };

        favorites.put(user, Buffer.Buffer<Nat64>(0));
        return #ok();

    };

    public shared ({ caller }) func addFavorite(productId : Nat64) : async Result<(), Text> {

        switch (favorites.get(caller)) {
            case (null) {
                return #err("Favorite list not found");
            };
            case (?list) {
                list.add(productId);
                return #ok();
            };
        };

    };

    public shared ({ caller }) func removeFavorite(productId : Nat64) : async Result<(), Text> {

        switch (favorites.get(caller)) {
            case (null) {
                return #err("Favorite list not found");
            };
            case (?list) {
                list.filterEntries(func(_, x) = x != productId);
                return #ok();
            };
        };

    };

    public shared ({ caller }) func getFavoriteList(productCanisterId : Text) : async Result<[ProductWithoutImage], Text> {
        switch (favorites.get(caller)) {
            case (null) {
                return #err("Favorite list not found");
            };
            case (?list) {
                let favoriteProductIdIter = list.vals();
                let productActor = actor (productCanisterId) : ProductActorModules.ProductActor;
                let favoriteProductList = Buffer.Buffer<ProductWithoutImage>(0);
                for (productId in favoriteProductIdIter) {
                    let product = await productActor.getProduct(productId, null);
                    switch (product) {
                        case (?product) {
                            favoriteProductList.add(product);
                        };
                        case (null) {
                            return #err("Product not found");
                        };
                    };
                };
                return #ok(Iter.toArray(favoriteProductList.vals()));
            };
        };
    };

};
