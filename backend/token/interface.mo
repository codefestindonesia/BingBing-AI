import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";

module {

    type Result<Ok, Error> = Result.Result<Ok, Error>;

    public type TokenActor = actor {
        balance : () -> async Result<Nat, Text>;
        mint : (owner : Principal, amount : Nat) -> async Result<(), Text>;
        burn : (owner : Principal, amount : Nat) -> async Result<(), Text>;
        transfer : (to : Principal, amount : Nat) -> async Result<(), Text>;
    };
};
