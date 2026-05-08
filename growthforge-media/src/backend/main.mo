import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import List "mo:core/List";

actor {
  type Lead = {
    name : Text;
    businessName : Text;
    email : Text;
    phone : Text;
    monthlyBudget : Text;
    message : Text;
    timestamp : Time.Time;
  };

  module Lead {
    public func compare(lead1 : Lead, lead2 : Lead) : Order.Order {
      Text.compare(lead1.name, lead2.name);
    };
  };

  let leads = List.empty<Lead>();

  public shared ({ caller }) func submitLead(lead : Lead) : async () {
    leads.add(lead);
  };

  public query ({ caller }) func getAllLeads() : async [Lead] {
    leads.toArray().sort();
  };

  public query ({ caller }) func getSubmissionCount() : async Nat {
    leads.size();
  };
};
