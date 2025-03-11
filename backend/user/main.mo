import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Types "types";
import TokenActorModules "../token/interface";
import CartActorModules "../cart/interface";
import FavoriteActorModules "../favorite/interface";

actor {

    type Result<Ok, Error> = Types.Result<Ok, Error>;
    type HashMap<K, V> = Types.HashMap<K, V>;
    type User = Types.User;

    let users = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);

    public shared ({ caller }) func createUser(
        tokenCanisterId : Text,
        cartCanisterId : Text,
        favoriteCanisterId : Text,
        user : User,
        owner : ?Principal,
    ) : async Result<(), Text> {

        let tokenActor = actor (tokenCanisterId) : TokenActorModules.TokenActor;
        let cartActor = actor (cartCanisterId) : CartActorModules.CartActor;
        let favoriteActor = actor (favoriteCanisterId) : FavoriteActorModules.FavoriteActor;

        switch (owner) {
            case (?owner) {
                switch (users.get(owner)) {
                    case (null) {
                        users.put(owner, user);
                        let mintRes = await tokenActor.mint(owner, 1000);
                        if (mintRes != #ok()) return #err("Cannot mint token, ambiguous Identity");
                        cartActor.createCart(owner);
                        favoriteActor.createFavoriteList(owner);
                        return #ok();
                    };
                    case (?user) {
                        return #err("User already exists");
                    };
                };
            };
            case (null) {
                switch (users.get(caller)) {
                    case (null) {
                        users.put(caller, user);
                        let mintRes = await tokenActor.mint(caller, 1000);
                        if (mintRes != #ok()) return #err("Cannot mint token, ambiguous Identity");
                        cartActor.createCart(caller);
                        return #ok();
                    };
                    case (?user) {
                        return #err("User already exists");
                    };
                };
            };
        };
    };

    public shared query ({ caller }) func getUser(principal : ?Text) : async Result<User, Text> {
        switch (principal) {
            case (?principal) {
                switch (users.get(Principal.fromText(principal))) {
                    case (?user) {
                        return #ok(user);
                    };
                    case (null) {
                        return #err("User not found : " # principal);
                    };
                };
            };
            case (null) {
                switch (users.get(caller)) {
                    case (?user) {
                        return #ok(user);
                    };
                    case (null) {
                        return #err("User not found : " # Principal.toText(caller));
                    };
                };
            };
        };
    };

    public shared ({ caller }) func updateUser(user : User) : async Result<(), Text> {
        switch (users.get(caller)) {
            case (?_) {
                users.put(caller, user);
                return #ok();
            };
            case (null) {
                return #err("User not found");
            };
        };
    };

};
