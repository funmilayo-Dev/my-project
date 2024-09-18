import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Option "mo:base/Option";

actor online_voting {

    private stable var candidatesEntries : [(Text, Nat)] = [];
    private stable var votersEntries : [(Principal, Bool)] = [];
    private stable var adminPrincipal : ?Principal = null;
    
    private var candidates = HashMap.HashMap<Text, Nat>(10, Text.equal, Text.hash);
    private var voters = HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);

    // Initialize the hashmaps from stable variables
    system func preupgrade() {
        candidatesEntries := Iter.toArray(candidates.entries());
        votersEntries := Iter.toArray(voters.entries());
    };

    system func postupgrade() {
        candidates := HashMap.fromIter<Text, Nat>(candidatesEntries.vals(), 10, Text.equal, Text.hash);
        voters := HashMap.fromIter<Principal, Bool>(votersEntries.vals(), 10, Principal.equal, Principal.hash);
    };

    public shared(msg) func initializeSystem() : async Result.Result<(), Text> {
        switch (adminPrincipal) {
            case (null) {
                adminPrincipal := ?msg.caller;
                #ok()
            };
            case (?_) {
                #err("System already initialized")
            };
        }
    };

    public shared(msg) func addCandidate(name: Text) : async Result.Result<(), Text> {
        if (candidates.get(name) != null) {
            return #err("Candidate already exists");
        };
        candidates.put(name, 0);
        #ok(())
    };

    public shared(msg) func vote(name: Text) : async Result.Result<(), Text> {
        let caller = msg.caller;

        switch (voters.get(caller)) {
            case (?_) { return #err("You have already voted.") };
            case null {
                switch (candidates.get(name)) {
                    case (?votes) {
                        candidates.put(name, votes + 1);
                        voters.put(caller, true);
                        #ok(())
                    };
                    case null { #err("Candidate not found.") };
                };
            };
        };
    };

    public query func getResults() : async [(Text, Nat)] {
        Iter.toArray(candidates.entries())
    };

    public query func getCandidates() : async [Text] {
        Iter.toArray(candidates.keys())
    };

    public query func getVoterCount() : async Nat {
        voters.size()
    };

    // For testing and admin purposes
    public shared(msg) func reset() : async Result.Result<(), Text> {
        switch (adminPrincipal) {
            case (?admin) {
                if (Principal.equal(msg.caller, admin)) {
                    candidates := HashMap.HashMap<Text, Nat>(10, Text.equal, Text.hash);
                    voters := HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);
                    #ok(())
                } else {
                    #err("Only the admin can reset the system.")
                }
            };
            case (null) {
                #err("System not initialized")
            };
        }
    };
};