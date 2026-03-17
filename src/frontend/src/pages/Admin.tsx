import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  BarChart3,
  Download,
  Edit,
  Package,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { ImageIcon, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { loadConfig } from "../config";
import { categories } from "../data/products";
import type { Product } from "../data/products";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useStore } from "../store/useStore";
import type { AdminCoupon } from "../store/useStore";
import { StorageClient } from "../utils/StorageClient";
import { exportToCSV } from "../utils/csvExport";

interface AdminProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

const emptyProductForm = {
  name: "",
  designerName: "",
  categoryId: "",
  pricePerDay: "",
  depositAmount: "",
  sizes: [] as string[],
  colors: "",
  occasions: "",
  description: "",
  imageUrl: "",
};

const emptyCouponForm = {
  code: "",
  type: "Percentage" as "Percentage" | "Fixed",
  value: "",
  maxUses: "",
};

export default function Admin({ onNavigate }: AdminProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "bookings" | "users" | "coupons"
  >("overview");

  const { identity } = useInternetIdentity();
  const {
    user,
    bookings,
    adminProducts,
    adminCoupons,
    registeredUsers,
    addProduct,
    updateProduct,
    deleteProduct,
    addCoupon,
    updateCoupon,
    deleteCoupon,
  } = useStore();

  // Product modal state
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState(emptyProductForm);

  // Product delete confirm
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  // Coupon modal state
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [couponForm, setCouponForm] = useState(emptyCouponForm);

  // Coupon delete confirm
  const [deleteCouponCode, setDeleteCouponCode] = useState<string | null>(null);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500 mb-4">
            You need admin privileges to access this page.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="bg-rose-700 text-white px-8 py-3 rounded-full font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // ── Product handlers ──────────────────────────────────────────────────────
  function openAddProduct() {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setImageFile(null);
    setImagePreviewUrl(null);
    setUploadProgress(null);
    setProductDialogOpen(true);
  }

  function openEditProduct(p: Product) {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      designerName: p.designerName,
      categoryId: p.categoryId,
      pricePerDay: String(p.pricePerDay),
      depositAmount: String(p.depositAmount),
      sizes: p.sizes,
      colors: p.colors.join(", "),
      occasions: p.occasions.join(", "),
      description: p.description,
      imageUrl: p.images[0] ?? "",
    });
    setImageFile(null);
    setImagePreviewUrl(null);
    setUploadProgress(null);
    setProductDialogOpen(true);
  }

  function toggleSize(size: string) {
    setProductForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  }

  async function submitProduct() {
    if (
      !productForm.name ||
      !productForm.categoryId ||
      !productForm.pricePerDay
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    let resolvedImageUrl = editingProduct
      ? (editingProduct.images[0] ??
        "/assets/generated/product-lehenga-1.dim_600x800.jpg")
      : "/assets/generated/product-lehenga-1.dim_600x800.jpg";

    if (productForm.imageUrl) {
      resolvedImageUrl = productForm.imageUrl;
    }

    if (imageFile) {
      try {
        setUploadProgress(0);
        const config = await loadConfig();
        const agentOptions = identity ? { identity } : {};
        const agent = new HttpAgent({
          host: config.backend_host,
          ...agentOptions,
        });
        if (config.backend_host?.includes("localhost")) {
          await agent.fetchRootKey().catch(() => {});
        }
        const storageClient = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent,
        );
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes, (pct) =>
          setUploadProgress(pct),
        );
        resolvedImageUrl = await storageClient.getDirectURL(hash);
        setUploadProgress(100);
      } catch (err) {
        console.error("Image upload failed:", err);
        if (!productForm.imageUrl && !editingProduct) {
          toast.error(
            "Image upload failed. Please try again or paste an image URL.",
          );
          setUploadProgress(null);
          return;
        }
        // Fall through to use imageUrl or existing image
        setUploadProgress(null);
      }
    }

    const base = {
      name: productForm.name,
      designerName: productForm.designerName,
      categoryId: productForm.categoryId,
      pricePerDay: Number(productForm.pricePerDay),
      depositAmount: Number(productForm.depositAmount),
      sizes: productForm.sizes.length ? productForm.sizes : ["Free Size"],
      colors: productForm.colors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      occasions: productForm.occasions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      description: productForm.description,
      images: [resolvedImageUrl],
      rating: 4.5,
      reviewCount: 0,
      isAvailable: true,
    };
    if (editingProduct) {
      updateProduct({ ...base, id: editingProduct.id });
      toast.success("Product updated successfully!");
    } else {
      addProduct({ ...base, id: `p${Date.now()}` });
      toast.success("Product added successfully!");
    }
    setProductDialogOpen(false);
    setImageFile(null);
    setImagePreviewUrl(null);
    setUploadProgress(null);
  }

  function confirmDeleteProduct() {
    if (deleteProductId) {
      deleteProduct(deleteProductId);
      setDeleteProductId(null);
      toast.success("Product deleted.");
    }
  }

  // ── Coupon handlers ───────────────────────────────────────────────────────
  function openAddCoupon() {
    setEditingCoupon(null);
    setCouponForm(emptyCouponForm);
    setCouponDialogOpen(true);
  }

  function openEditCoupon(c: AdminCoupon) {
    setEditingCoupon(c);
    const rawValue = c.value.replace(/[\u20b9%]/g, "").trim();
    setCouponForm({
      code: c.code,
      type: c.type,
      value: rawValue,
      maxUses: String(c.maxUses),
    });
    setCouponDialogOpen(true);
  }

  function submitCoupon() {
    if (!couponForm.code || !couponForm.value) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const displayValue =
      couponForm.type === "Percentage"
        ? `${couponForm.value}%`
        : `\u20b9${couponForm.value}`;
    const coupon: AdminCoupon = {
      code: couponForm.code.toUpperCase(),
      type: couponForm.type,
      value: displayValue,
      uses: editingCoupon ? editingCoupon.uses : 0,
      maxUses: Number(couponForm.maxUses) || 100,
      status: "Active",
    };
    if (editingCoupon) {
      updateCoupon(coupon);
      toast.success("Coupon updated successfully!");
    } else {
      addCoupon(coupon);
      toast.success("Coupon added successfully!");
    }
    setCouponDialogOpen(false);
  }

  function confirmDeleteCoupon() {
    if (deleteCouponCode) {
      deleteCoupon(deleteCouponCode);
      setDeleteCouponCode(null);
      toast.success("Coupon deleted.");
    }
  }

  // ── CSV Export helpers ────────────────────────────────────────────────────
  function exportUsers() {
    exportToCSV(
      "rentattire-users",
      ["Name", "Email", "Role", "Logins", "Last Login"],
      registeredUsers.map((u) => [
        u.name,
        u.email,
        u.role,
        String(u.loginCount),
        new Date(u.lastLoginAt).toLocaleString("en-IN"),
      ]),
    );
    toast.success("Users exported to CSV.");
  }

  function exportBookings() {
    exportToCSV(
      "rentattire-bookings",
      ["Booking ID", "Items", "Amount (\u20b9)", "Date", "Status"],
      bookings.map((b) => [
        b.id,
        String(b.items.length),
        String(b.finalAmount),
        new Date(b.createdAt).toLocaleDateString("en-IN"),
        b.status,
      ]),
    );
    toast.success("Bookings exported to CSV.");
  }

  function exportProducts() {
    exportToCSV(
      "rentattire-products",
      [
        "ID",
        "Name",
        "Designer",
        "Category",
        "Price/Day",
        "Rating",
        "Available",
      ],
      adminProducts.map((p) => [
        p.id,
        p.name,
        p.designerName,
        categories.find((c) => c.id === p.categoryId)?.name ?? p.categoryId,
        String(p.pricePerDay),
        String(p.rating),
        p.isAvailable ? "Yes" : "No",
      ]),
    );
    toast.success("Products exported to CSV.");
  }

  function exportCoupons() {
    exportToCSV(
      "rentattire-coupons",
      ["Code", "Type", "Value", "Uses", "Max Uses", "Status"],
      adminCoupons.map((c) => [
        c.code,
        c.type,
        c.value,
        String(c.uses),
        String(c.maxUses),
        c.status,
      ]),
    );
    toast.success("Coupons exported to CSV.");
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.totalRental + b.totalDeposit, 0);
  const activeRentals = bookings.filter(
    (b) => b.status === "active" || b.status === "upcoming",
  ).length;
  const now = new Date();
  const thisMonthBookings = bookings.filter((b) => {
    const d = new Date(b.createdAt);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });
  const thisMonthRevenue = thisMonthBookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.totalRental + b.totalDeposit, 0);

  const stats = [
    {
      label: "Total Revenue",
      value:
        totalRevenue === 0 ? "₹0" : `₹${totalRevenue.toLocaleString("en-IN")}`,
      change:
        thisMonthRevenue > 0
          ? `+₹${thisMonthRevenue.toLocaleString("en-IN")} this month`
          : "No revenue this month",
      icon: BarChart3,
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Active Rentals",
      value: String(activeRentals),
      change: activeRentals > 0 ? `${activeRentals} ongoing` : "None ongoing",
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Products",
      value: String(adminProducts.length),
      change: `${adminProducts.length} total`,
      icon: Package,
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Registered Users",
      value: String(registeredUsers.length),
      change: `${registeredUsers.length} registered`,
      icon: Users,
      color: "bg-amber-50 text-amber-700",
    },
  ];

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      ocid: "admin.overview.tab",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      ocid: "admin.products.tab",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: ShoppingBag,
      ocid: "admin.bookings.tab",
    },
    { id: "users", label: "Users", icon: Users, ocid: "admin.users.tab" },
    { id: "coupons", label: "Coupons", icon: Tag, ocid: "admin.coupons.tab" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-700 rounded-lg flex items-center justify-center">
            <BarChart3 size={16} />
          </div>
          <div>
            <p className="font-semibold">RentAttire Admin</p>
            <p className="text-xs text-gray-400">Management Dashboard</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back to Store
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-ocid={tab.ocid}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-rose-700 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-rose-400"
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-5 border border-gray-100"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}
                  >
                    <stat.icon size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Recent Bookings
              </h3>
              {bookings.length === 0 ? (
                <p
                  className="text-gray-400 text-sm"
                  data-ocid="admin.bookings.empty_state"
                >
                  No bookings yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          #{b.id}
                        </p>
                        <p className="text-xs text-gray-400">
                          {b.items.length} item(s)
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        \u20b9{b.finalAmount.toLocaleString()}
                      </p>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">
                Products ({adminProducts.length})
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid="admin.products.export_button"
                  onClick={exportProducts}
                  className="flex items-center gap-1.5 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:text-rose-700 transition-colors"
                >
                  <Download size={13} /> Export CSV
                </button>
                <button
                  type="button"
                  data-ocid="admin.products.open_modal_button"
                  onClick={openAddProduct}
                  className="flex items-center gap-2 bg-rose-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-800"
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" data-ocid="admin.products.table">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="text-left px-5 py-3">Product</th>
                      <th className="text-left px-5 py-3">Designer</th>
                      <th className="text-left px-5 py-3">Category</th>
                      <th className="text-left px-5 py-3">Price/Day</th>
                      <th className="text-left px-5 py-3">Rating</th>
                      <th className="text-left px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminProducts.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-8 text-center text-gray-400"
                          data-ocid="admin.products.empty_state"
                        >
                          No products yet. Add your first product.
                        </td>
                      </tr>
                    )}
                    {adminProducts.map((p, idx) => {
                      const cat = categories.find((c) => c.id === p.categoryId);
                      return (
                        <tr
                          key={p.id}
                          data-ocid={`admin.products.row.${idx + 1}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-10 h-12 object-cover rounded-lg"
                              />
                              <span className="text-sm font-medium text-gray-900">
                                {p.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-600">
                            {p.designerName}
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-600">
                            {cat?.name}
                          </td>
                          <td className="px-5 py-3 text-sm font-medium">
                            \u20b9{p.pricePerDay.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-sm">
                            \u2605 {p.rating}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                data-ocid={`admin.products.edit_button.${idx + 1}`}
                                onClick={() => openEditProduct(p)}
                                className="p-1.5 text-gray-400 hover:text-blue-600"
                                title="Edit product"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                data-ocid={`admin.products.delete_button.${idx + 1}`}
                                onClick={() => setDeleteProductId(p.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600"
                                title="Delete product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === "bookings" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">All Bookings</h2>
              <button
                type="button"
                data-ocid="admin.bookings.export_button"
                onClick={exportBookings}
                className="flex items-center gap-1.5 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:text-rose-700 transition-colors"
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {bookings.length === 0 ? (
                <div
                  className="p-12 text-center text-gray-400"
                  data-ocid="admin.bookings.empty_state"
                >
                  <p>No bookings yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full" data-ocid="admin.bookings.table">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="text-left px-5 py-3">Booking ID</th>
                        <th className="text-left px-5 py-3">Items</th>
                        <th className="text-left px-5 py-3">Amount</th>
                        <th className="text-left px-5 py-3">Date</th>
                        <th className="text-left px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map((b, idx) => (
                        <tr
                          key={b.id}
                          data-ocid={`admin.bookings.row.${idx + 1}`}
                        >
                          <td className="px-5 py-3 text-sm font-medium text-gray-900">
                            #{b.id}
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-600">
                            {b.items.length} item(s)
                          </td>
                          <td className="px-5 py-3 text-sm font-semibold">
                            \u20b9{b.finalAmount.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-500">
                            {new Date(b.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">
                Users ({registeredUsers.length})
              </h2>
              <button
                type="button"
                data-ocid="admin.users.export_button"
                onClick={exportUsers}
                className="flex items-center gap-1.5 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:text-rose-700 transition-colors"
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {registeredUsers.length === 0 ? (
                <div
                  className="p-12 text-center text-gray-400"
                  data-ocid="admin.users.empty_state"
                >
                  <p>No users have logged in yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full" data-ocid="admin.users.table">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="text-left px-5 py-3">Name</th>
                        <th className="text-left px-5 py-3">Email</th>
                        <th className="text-left px-5 py-3">Role</th>
                        <th className="text-left px-5 py-3">Logins</th>
                        <th className="text-left px-5 py-3">Last Login</th>
                        <th className="text-left px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {registeredUsers.map((u, i) => {
                        const isOnline = user?.id === u.id;
                        return (
                          <tr
                            key={u.id}
                            data-ocid={`admin.users.row.${i + 1}`}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 text-xs font-bold">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {u.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-600">
                              {u.email}
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  u.role === "admin"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-700 font-medium">
                              {u.loginCount}
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-500">
                              {new Date(u.lastLoginAt).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </td>
                            <td className="px-5 py-3">
                              {isOnline ? (
                                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                                  Online
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">
                                  Last seen:{" "}
                                  {new Date(u.lastLoginAt).toLocaleDateString(
                                    "en-IN",
                                  )}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Coupons */}
        {activeTab === "coupons" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Coupon Codes</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid="admin.coupons.export_button"
                  onClick={exportCoupons}
                  className="flex items-center gap-1.5 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:text-rose-700 transition-colors"
                >
                  <Download size={13} /> Export CSV
                </button>
                <button
                  type="button"
                  data-ocid="admin.coupons.open_modal_button"
                  onClick={openAddCoupon}
                  className="flex items-center gap-2 bg-rose-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-800"
                >
                  <Plus size={16} /> Add Coupon
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full" data-ocid="admin.coupons.table">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="text-left px-5 py-3">Code</th>
                    <th className="text-left px-5 py-3">Type</th>
                    <th className="text-left px-5 py-3">Value</th>
                    <th className="text-left px-5 py-3">Uses</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {adminCoupons.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-8 text-center text-gray-400"
                        data-ocid="admin.coupons.empty_state"
                      >
                        No coupons yet.
                      </td>
                    </tr>
                  )}
                  {adminCoupons.map((c, i) => (
                    <tr key={c.code} data-ocid={`admin.coupons.row.${i + 1}`}>
                      <td className="px-5 py-3 font-mono font-bold text-sm text-gray-900">
                        {c.code}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">
                        {c.type}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-rose-700">
                        {c.value}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">
                        {c.uses}/{c.maxUses}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            c.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            data-ocid={`admin.coupons.edit_button.${i + 1}`}
                            onClick={() => openEditCoupon(c)}
                            className="p-1.5 text-gray-400 hover:text-blue-600"
                            title="Edit coupon"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            data-ocid={`admin.coupons.delete_button.${i + 1}`}
                            onClick={() => setDeleteCouponCode(c.code)}
                            className="p-1.5 text-gray-400 hover:text-red-600"
                            title="Delete coupon"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Product Add/Edit Dialog ── */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.products.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="prod-name">Product Name *</Label>
                <Input
                  id="prod-name"
                  data-ocid="admin.products.input"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Crimson Bridal Lehenga"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="prod-designer">Designer Name</Label>
                <Input
                  id="prod-designer"
                  value={productForm.designerName}
                  onChange={(e) =>
                    setProductForm((f) => ({
                      ...f,
                      designerName: e.target.value,
                    }))
                  }
                  placeholder="e.g. Manish Malhotra"
                />
              </div>
              <div className="col-span-2">
                <Label>Category *</Label>
                <Select
                  value={productForm.categoryId}
                  onValueChange={(v) =>
                    setProductForm((f) => ({ ...f, categoryId: v }))
                  }
                >
                  <SelectTrigger data-ocid="admin.products.select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prod-price">Price Per Day (\u20b9) *</Label>
                <Input
                  id="prod-price"
                  type="number"
                  min="0"
                  value={productForm.pricePerDay}
                  onChange={(e) =>
                    setProductForm((f) => ({
                      ...f,
                      pricePerDay: e.target.value,
                    }))
                  }
                  placeholder="2500"
                />
              </div>
              <div>
                <Label htmlFor="prod-deposit">Deposit Amount (\u20b9)</Label>
                <Input
                  id="prod-deposit"
                  type="number"
                  min="0"
                  value={productForm.depositAmount}
                  onChange={(e) =>
                    setProductForm((f) => ({
                      ...f,
                      depositAmount: e.target.value,
                    }))
                  }
                  placeholder="10000"
                />
              </div>
            </div>

            <div>
              <Label>Sizes</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      productForm.sizes.includes(size)
                        ? "bg-rose-700 text-white border-rose-700"
                        : "border-gray-300 text-gray-600 hover:border-rose-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="prod-colors">Colors (comma-separated)</Label>
              <Input
                id="prod-colors"
                value={productForm.colors}
                onChange={(e) =>
                  setProductForm((f) => ({ ...f, colors: e.target.value }))
                }
                placeholder="Red, Maroon, Pink"
              />
            </div>

            <div>
              <Label htmlFor="prod-occasions">
                Occasions (comma-separated)
              </Label>
              <Input
                id="prod-occasions"
                value={productForm.occasions}
                onChange={(e) =>
                  setProductForm((f) => ({ ...f, occasions: e.target.value }))
                }
                placeholder="Wedding, Party, Formal"
              />
            </div>

            <div>
              <Label htmlFor="prod-desc">Description</Label>
              <Textarea
                id="prod-desc"
                data-ocid="admin.products.textarea"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Describe the outfit..."
                rows={3}
              />
            </div>
          </div>
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>
              Product Image{" "}
              {!editingProduct && <span className="text-rose-600">*</span>}
            </Label>
            <label
              htmlFor="prod-image-upload"
              data-ocid="admin.product.dropzone"
              className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors block ${
                imagePreviewUrl
                  ? "border-rose-300 bg-rose-50"
                  : "border-gray-300 hover:border-rose-400 hover:bg-rose-50/30"
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file?.type.startsWith("image/")) {
                  setImageFile(file);
                  setImagePreviewUrl(URL.createObjectURL(file));
                  setUploadProgress(null);
                }
              }}
            >
              <input
                ref={fileInputRef}
                id="prod-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                data-ocid="admin.product.upload_button"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreviewUrl(URL.createObjectURL(file));
                    setUploadProgress(null);
                  }
                }}
              />
              {imagePreviewUrl ? (
                <div
                  data-ocid="admin.product.success_state"
                  className="space-y-2"
                >
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-lg shadow-sm"
                  />
                  <p className="text-xs text-rose-700 font-medium">
                    {imageFile ? imageFile.name : "Current image"} — click to
                    change
                  </p>
                </div>
              ) : editingProduct?.images[0] ? (
                <div
                  data-ocid="admin.product.success_state"
                  className="space-y-2"
                >
                  <img
                    src={editingProduct.images[0]}
                    alt="Current"
                    className="mx-auto h-32 w-32 object-cover rounded-lg shadow-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Current image — click to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="mx-auto w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-rose-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              )}
            </label>
            {uploadProgress !== null && (
              <div
                data-ocid="admin.product.loading_state"
                className="space-y-1"
              >
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Uploading image\u2026</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress
                  value={uploadProgress}
                  className="h-1.5 [&>div]:bg-rose-600"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="admin.products.cancel_button"
              onClick={() => {
                setProductDialogOpen(false);
                setProductForm((f) => ({ ...f, imageUrl: "" }));
              }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.products.submit_button"
              onClick={submitProduct}
              className="bg-rose-700 hover:bg-rose-800 text-white"
              disabled={uploadProgress !== null && uploadProgress < 100}
            >
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Product Delete Confirm ── */}
      <Dialog
        open={!!deleteProductId}
        onOpenChange={(open) => !open && setDeleteProductId(null)}
      >
        <DialogContent data-ocid="admin.products.delete.dialog">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="admin.products.cancel_button"
              onClick={() => setDeleteProductId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="admin.products.confirm_button"
              onClick={confirmDeleteProduct}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Coupon Add/Edit Dialog ── */}
      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <DialogContent data-ocid="admin.coupons.dialog">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="coupon-code">Coupon Code *</Label>
              <Input
                id="coupon-code"
                data-ocid="admin.coupons.input"
                value={couponForm.code}
                onChange={(e) =>
                  setCouponForm((f) => ({
                    ...f,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="SAVE20"
                disabled={!!editingCoupon}
                className="font-mono uppercase"
              />
            </div>
            <div>
              <Label>Type *</Label>
              <Select
                value={couponForm.type}
                onValueChange={(v: "Percentage" | "Fixed") =>
                  setCouponForm((f) => ({ ...f, type: v }))
                }
              >
                <SelectTrigger data-ocid="admin.coupons.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Percentage">Percentage (%)</SelectItem>
                  <SelectItem value="Fixed">Fixed Amount (\u20b9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="coupon-value">
                {couponForm.type === "Percentage"
                  ? "Discount (%)"
                  : "Discount Amount (\u20b9)"}{" "}
                *
              </Label>
              <Input
                id="coupon-value"
                type="number"
                min="0"
                value={couponForm.value}
                onChange={(e) =>
                  setCouponForm((f) => ({ ...f, value: e.target.value }))
                }
                placeholder={couponForm.type === "Percentage" ? "20" : "500"}
              />
            </div>
            <div>
              <Label htmlFor="coupon-maxuses">Max Uses</Label>
              <Input
                id="coupon-maxuses"
                type="number"
                min="1"
                value={couponForm.maxUses}
                onChange={(e) =>
                  setCouponForm((f) => ({ ...f, maxUses: e.target.value }))
                }
                placeholder="100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="admin.coupons.cancel_button"
              onClick={() => setCouponDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.coupons.submit_button"
              onClick={submitCoupon}
              className="bg-rose-700 hover:bg-rose-800 text-white"
            >
              {editingCoupon ? "Save Changes" : "Add Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Coupon Delete Confirm ── */}
      <Dialog
        open={!!deleteCouponCode}
        onOpenChange={(open) => !open && setDeleteCouponCode(null)}
      >
        <DialogContent data-ocid="admin.coupons.delete_button">
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete coupon{" "}
            <strong>{deleteCouponCode}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="admin.coupons.cancel_button"
              onClick={() => setDeleteCouponCode(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-ocid="admin.coupons.confirm_button"
              onClick={confirmDeleteCoupon}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
