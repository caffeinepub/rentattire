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

  // ── Legacy type — kept for stable variable migration compatibility ────────
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

  // ── Current product type ─────────────────────────────────────────────
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

  // ── Legacy maps — kept with original types so upgrade checker is satisfied ──
  // These match what was in the previously deployed canister exactly.
  // They will be empty in production (were `let`, not `stable var` before),
  // but must be declared here to allow the canister upgrade to proceed.
  let productMap : Map.Map<Text, ProductV1> = Map.empty();
  let productMapV2 : Map.Map<Text, Product> = Map.empty();

  // ── New stable storage — survives all future upgrades ──────────────────
  stable var productEntries : [(Text, Product)] = [];

  // ── In-memory working map, seeded from stable storage on startup ───────
  let activeProducts : Map.Map<Text, Product> = do {
    let m = Map.empty<Text, Product>();
    // One-time migration: if productMapV2 has data, bring it over
    for ((k, v) in productMapV2.entries().toArray().vals()) {
      m.add(k, v);
    };
    // Normal restore: load from stable productEntries
    for ((k, v) in productEntries.vals()) {
      m.add(k, v);
    };
    m
  };

  // Persist working map to stable storage before every upgrade
  system func preupgrade() {
    productEntries := activeProducts.entries().toArray();
  };

  // ── Product CRUD ──────────────────────────────────────────────────────────
  public shared ({ caller = _ }) func addProduct(product : Product) : async Bool {
    activeProducts.add(product.id, product);
    productEntries := activeProducts.entries().toArray();
    true
  };

  public shared ({ caller = _ }) func updateProduct(product : Product) : async Bool {
    switch (activeProducts.get(product.id)) {
      case null false;
      case _ {
        activeProducts.add(product.id, product);
        productEntries := activeProducts.entries().toArray();
        true
      };
    }
  };

  public shared ({ caller = _ }) func deleteProduct(id : Text) : async Bool {
    activeProducts.remove(id);
    productEntries := activeProducts.entries().toArray();
    true
  };

  public query func getProducts() : async [Product] {
    activeProducts.values().toArray()
  };

  public query func getProduct(id : Text) : async ?Product {
    activeProducts.get(id)
  };

  // ── Stripe ───────────────────────────────────────────────────────────────
  public query func isStripeConfigured() : async Bool {
    false
  };

  public shared ({ caller = _ }) func setStripeConfiguration(_ : Stripe.StripeConfiguration) : async () { () };

  public func getStripeSessionStatus(_ : Text) : async Stripe.StripeSessionStatus {
    #failed { error = "Not available for testing" }
  };

  public shared ({ caller = _ }) func createCheckoutSession(_ : [Stripe.ShoppingItem], _ : Text, _ : Text) : async Text {
    "Not available for testing"
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input)
  };
};
