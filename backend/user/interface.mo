import Result "mo:base/Result";
import Types "./types";

module {

    type Result<Ok, Error> = Result.Result<Ok, Error>;
    type User = Types.User;

    public type UserActor = actor {
        getUser: (principal : ?Text) -> async Result<User, Text>;
    };
};
