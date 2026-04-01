import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createActorWithConfig } from "../config";
import type { Product } from "../data/products";

export type { Product };

export interface AdminCoupon {
  code: string;
  type: "Percentage" | "Fixed";
  value: string;
  uses: number;
  maxUses: number;
  status: "Active" | "Expired";
}

export interface CartItem {
  productId: string;
  productName: string;
  designerName: string;
  image: string;
  size: string;
  color: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  pricePerDay: number;
  depositAmount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  lastLoginAt: string;
  loginCount: number;
}

export interface Booking {
  id: string;
  items: CartItem[];
  totalRental: number;
  totalDeposit: number;
  discount: number;
  finalAmount: number;
  status: "upcoming" | "active" | "returned" | "cancelled";
  createdAt: string;
  address: Address;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

const defaultCoupons: AdminCoupon[] = [
  {
    code: "FIRST20",
    type: "Percentage",
    value: "20%",
    uses: 234,
    maxUses: 1000,
    status: "Active",
  },
  {
    code: "SAVE10",
    type: "Percentage",
    value: "10%",
    uses: 156,
    maxUses: 500,
    status: "Active",
  },
  {
    code: "FASHION15",
    type: "Percentage",
    value: "15%",
    uses: 89,
    maxUses: 200,
    status: "Active",
  },
  {
    code: "FLAT500",
    type: "Fixed",
    value: "\u20b9500",
    uses: 45,
    maxUses: 100,
    status: "Expired",
  },
];

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  bookings: Booking[];
  couponCode: string;
  couponDiscount: number;

  // Admin state
  adminProducts: Product[];
  adminCoupons: AdminCoupon[];
  registeredUsers: RegisteredUser[];
  productsLoaded: boolean;

  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;

  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  login: (user: User) => void;
  logout: () => void;

  addBooking: (booking: Booking) => void;

  applyCoupon: (code: string) => boolean;
  clearCoupon: () => void;

  // Product actions (backend-aware)
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Admin coupon actions
  addCoupon: (coupon: AdminCoupon) => void;
  updateCoupon: (coupon: AdminCoupon) => void;
  deleteCoupon: (code: string) => void;
}

const VALID_COUPONS: Record<string, number> = {
  FIRST20: 0.2,
  SAVE10: 0.1,
  FASHION15: 0.15,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      user: null,
      bookings: [],
      couponCode: "",
      couponDiscount: 0,
      adminProducts: [],
      adminCoupons: defaultCoupons,
      registeredUsers: [],
      productsLoaded: false,

      addToCart: (item) =>
        set((state) => {
          const exists = state.cart.find(
            (c) => c.productId === item.productId && c.size === item.size,
          );
          if (exists) {
            return {
              cart: state.cart.map((c) =>
                c.productId === item.productId && c.size === item.size
                  ? item
                  : c,
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),

      removeFromCart: (productId, size) =>
        set((state) => ({
          cart: state.cart.filter(
            (c) => !(c.productId === productId && c.size === size),
          ),
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),

      isInWishlist: (productId) => get().wishlist.includes(productId),

      login: (user) =>
        set((state) => {
          const now = new Date().toISOString();
          const existing = state.registeredUsers.find((u) => u.id === user.id);
          let registeredUsers: RegisteredUser[];
          if (existing) {
            registeredUsers = state.registeredUsers.map((u) =>
              u.id === user.id
                ? { ...u, lastLoginAt: now, loginCount: u.loginCount + 1 }
                : u,
            );
          } else {
            registeredUsers = [
              ...state.registeredUsers,
              {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                lastLoginAt: now,
                loginCount: 1,
              },
            ];
          }
          return { user, registeredUsers };
        }),

      logout: () => set({ user: null }),

      addBooking: (booking) =>
        set((state) => ({ bookings: [booking, ...state.bookings] })),

      applyCoupon: (code) => {
        const discount = VALID_COUPONS[code.toUpperCase()];
        if (discount) {
          set({ couponCode: code.toUpperCase(), couponDiscount: discount });
          return true;
        }
        return false;
      },

      clearCoupon: () => set({ couponCode: "", couponDiscount: 0 }),

      fetchProducts: async () => {
        try {
          const actor = await createActorWithConfig();
          const backendProducts = await actor.getProducts();
          const products: Product[] = backendProducts.map((p) => ({
            id: p.id,
            name: p.name,
            designerName: p.designerName ?? "",
            categoryId: "",
            pricePerDay: Number(p.pricePerDay),
            depositAmount: Number(p.depositAmount),
            sizes: Array.from(p.sizes),
            colors: Array.from(p.colors ?? []),
            occasions: Array.from(p.occasions),
            description: p.description,
            images: Array.from(p.images),
            rating: Number(p.rating ?? 0),
            reviewCount: Number(p.reviewCount ?? 0),
            isAvailable: p.isAvailable,
          }));
          set({ adminProducts: products, productsLoaded: true });
        } catch (err) {
          console.error("Failed to fetch products from backend:", err);
          set({ productsLoaded: true });
          throw err;
        }
      },

      addProduct: async (product) => {
        try {
          const actor = await createActorWithConfig();
          const addSuccess = await actor.addProduct({
            id: product.id,
            name: product.name,
            pricePerDay: product.pricePerDay,
            depositAmount: product.depositAmount,
            sizes: product.sizes,
            occasions: product.occasions,
            description: product.description,
            images: product.images,
            isAvailable: product.isAvailable,
            rating: (product as any).rating ?? 4.5,
            reviewCount: (product as any).reviewCount ?? 0,
            designerName: (product as any).designerName ?? "",
            colors: (product as any).colors ?? [],
          });
          if (!addSuccess)
            throw new Error("Backend returned false for addProduct");
          // Refresh from canister to confirm sync across all devices
          await get().fetchProducts();
        } catch (err) {
          console.error("Failed to save product to backend:", err);
          throw err;
        }
      },

      updateProduct: async (product) => {
        const prev = get().adminProducts;
        set((state) => ({
          adminProducts: state.adminProducts.map((p) =>
            p.id === product.id ? product : p,
          ),
        }));
        try {
          const actor = await createActorWithConfig();
          const updateSuccess = await actor.updateProduct({
            id: product.id,
            name: product.name,
            pricePerDay: product.pricePerDay,
            depositAmount: product.depositAmount,
            sizes: product.sizes,
            occasions: product.occasions,
            description: product.description,
            images: product.images,
            isAvailable: product.isAvailable,
            rating: (product as any).rating ?? 4.5,
            reviewCount: (product as any).reviewCount ?? 0,
            designerName: (product as any).designerName ?? "",
            colors: (product as any).colors ?? [],
          });
          if (!updateSuccess)
            throw new Error("Backend returned false for updateProduct");
          // Refresh from canister to confirm sync
          await get().fetchProducts();
        } catch (err) {
          console.error("Failed to update product in backend:", err);
          set({ adminProducts: prev });
          throw err;
        }
      },

      deleteProduct: async (id) => {
        const prev = get().adminProducts;
        set((state) => ({
          adminProducts: state.adminProducts.filter((p) => p.id !== id),
        }));
        try {
          const actor = await createActorWithConfig();
          const deleteSuccess = await actor.deleteProduct(id);
          if (!deleteSuccess)
            throw new Error("Backend returned false for deleteProduct");
          // Refresh from canister to confirm sync
          await get().fetchProducts();
        } catch (err) {
          console.error("Failed to delete product from backend:", err);
          set({ adminProducts: prev });
          throw err;
        }
      },

      addCoupon: (coupon) =>
        set((state) => ({ adminCoupons: [...state.adminCoupons, coupon] })),

      updateCoupon: (coupon) =>
        set((state) => ({
          adminCoupons: state.adminCoupons.map((c) =>
            c.code === coupon.code ? coupon : c,
          ),
        })),

      deleteCoupon: (code) =>
        set((state) => ({
          adminCoupons: state.adminCoupons.filter((c) => c.code !== code),
        })),
    }),
    {
      name: "rentattire-store",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
        bookings: state.bookings,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
        adminCoupons: state.adminCoupons,
        registeredUsers: state.registeredUsers,
        // Do NOT persist adminProducts -- always fetch fresh from backend
      }),
    },
  ),
);
