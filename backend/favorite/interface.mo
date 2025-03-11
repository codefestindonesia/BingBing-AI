import Result "mo:base/Result";
import Principal "mo:base/Principal";

module {

    type Result<Ok, Error> = Result.Result<Ok, Error>;

    public type FavoriteActor = actor {
        createFavoriteList : (user: Principal) -> ();
    };
};
