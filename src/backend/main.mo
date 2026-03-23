import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Map "mo:core/Map";
import Text "mo:core/Text";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ── Product types ──────────────────────────────────────────────────────────
  type Product = {
    id : Text;
    name : Text;
    categoryId : Text;
    pricePerDay : Float;
    depositAmount : Float;
    sizes : [Text];
    occasions : [Text];
    description : Text;
    images : [Text];
    isAvailable : Bool;
  };

  // Stable product storage (persistent actor keeps this across upgrades)
  let productMap : Map.Map<Text, Product> = Map.empty();

  // ── Product CRUD ──────────────────────────────────────────────────────────
  public shared ({ caller = _ }) func addProduct(product : Product) : async Bool {
    productMap.add(product.id, product);
    true;
  };

  public shared ({ caller = _ }) func updateProduct(product : Product) : async Bool {
    switch (productMap.get(product.id)) {
      case null false;
      case _ {
        productMap.add(product.id, product);
        true;
      };
    };
  };

  public shared ({ caller = _ }) func deleteProduct(id : Text) : async Bool {
    productMap.remove(id);
    true;
  };

  public query func getProducts() : async [Product] {
    productMap.values().toArray();
  };

  public query func getProduct(id : Text) : async ?Product {
    productMap.get(id);
  };

  // ── Stripe ───────────────────────────────────────────────────────────────
  public query func isStripeConfigured() : async Bool {
    false;
  };

  public shared ({ caller = _ }) func setStripeConfiguration(_ : Stripe.StripeConfiguration) : async () { () };

  public func getStripeSessionStatus(_ : Text) : async Stripe.StripeSessionStatus {
    #failed { error = "Not available for testing" };
  };

  public shared ({ caller = _ }) func createCheckoutSession(_ : [Stripe.ShoppingItem], _ : Text, _ : Text) : async Text {
    "Not available for testing";
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
