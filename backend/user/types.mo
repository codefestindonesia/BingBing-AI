import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";

module {

    public type Result<Ok, Err> = Result.Result<Ok, Err>;
    public type HashMap<Ok, Err> = HashMap.HashMap<Ok, Err>;
    public type User = {
        name : Text;
        email : Text;
        phoneNumber : Text;
        dateOfBirth : Time.Time;
        address : Text;
        image : Blob;
    };

};
