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

  // ── Legacy type (kept for stable variable migration) ─────────────────────────
  type ProductV1 = {
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

  // ── Current product type ───────────────────────────────────────────────
  type Product = {
    id : Text;
    name : Text;
    pricePerDay : Float;
    depositAmount : Float;
    sizes : [Text];
    occasions : [Text];
    description : Text;
    images : [Text];
    isAvailable : Bool;
    rating : Float;
    reviewCount : Float;
    designerName : Text;
    colors : [Text];
  };

  // Legacy map kept so the runtime can drop it cleanly on upgrade
  let productMap : Map.Map<Text, ProductV1> = Map.empty();

  // Current product storage
  let productMapV2 : Map.Map<Text, Product> = Map.empty();

  // ── Product CRUD ──────────────────────────────────────────────────────────
  public shared ({ caller = _ }) func addProduct(product : Product) : async Bool {
    productMapV2.add(product.id, product);
    true;
  };

  public shared ({ caller = _ }) func updateProduct(product : Product) : async Bool {
    switch (productMapV2.get(product.id)) {
      case null false;
      case _ {
        productMapV2.add(product.id, product);
        true;
      };
    };
  };

  public shared ({ caller = _ }) func deleteProduct(id : Text) : async Bool {
    productMapV2.remove(id);
    true;
  };

  public query func getProducts() : async [Product] {
    productMapV2.values().toArray();
  };

  public query func getProduct(id : Text) : async ?Product {
    productMapV2.get(id);
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
