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
import {
  BarChart3,
  Download,
  Edit,
  MessageSquare,
  Package,
  Plus,
  ShoppingBag,
  Star,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { ImageIcon, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import imgLehenga from "../assets/product-lehenga.jpg";
import { createStorageClientInstance } from "../config";
import type { Product } from "../data/products";
import { useStore } from "../store/useStore";
import type { AdminCoupon } from "../store/useStore";
import { exportToCSV } from "../utils/csvExport";

interface AdminProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

const emptyProductForm = {
  name: "",
  pricePerDay: "",
  depositAmount: "",
  sizes: [] as string[],
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

interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

const emptyReviewForm = {
  productId: "",
  userName: "",
  rating: 5,
  comment: "",
};

export default function Admin({ onNavigate }: AdminProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "bookings" | "users" | "coupons" | "reviews"
  >("overview");

  const {
    user,
    bookings,
    adminProducts,
    adminCoupons,
    registeredUsers,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>(
    [],
  );
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [productFormErrors, setProductFormErrors] = useState<{
    name?: string;
    pricePerDay?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reviews state
  const [adminReviews, setAdminReviews] = useState<AdminReview[]>([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<AdminReview | null>(null);
  const [reviewForm, setReviewForm] = useState(emptyReviewForm);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-black mb-2">
            Access Denied
          </h2>
          <p className="text-black mb-4">
            You need admin privileges to access this page.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="bg-rose-700 text-black px-8 py-3 rounded-full font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // ── Product handlers ────────────────────────────────────────────────────────────────────────
  function openAddProduct() {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setImageFiles([]);
    setImagePreviews([]);
    setRemovedExistingImages([]);
    setUploadProgress(null);
    setProductFormErrors({});
    setIsSubmitting(false);
    setProductDialogOpen(true);
  }

  function openEditProduct(p: Product) {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      pricePerDay: String(p.pricePerDay),
      depositAmount: String(p.depositAmount),
      sizes: p.sizes,
      occasions: p.occasions.join(", "),
      description: p.description,
      imageUrl: p.images[0] ?? "",
    });
    setImageFiles([]);
    setImagePreviews([]);
    setRemovedExistingImages([]);
    setUploadProgress(null);
    setProductFormErrors({});
    setIsSubmitting(false);
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
    const errors: { name?: string; pricePerDay?: string } = {};
    if (!productForm.name) errors.name = "Product name is required";
    if (!productForm.pricePerDay) errors.pricePerDay = "Price is required";
    if (Object.keys(errors).length > 0) {
      setProductFormErrors(errors);
      toast.error("Please fill in all required fields.");
      return;
    }
    setProductFormErrors({});
    setIsSubmitting(true);
    // Upload images to blob storage, fall back to base64 if unavailable
    async function uploadImageFile(file: File): Promise<string> {
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const storageClient = await createStorageClientInstance();
        const { hash } = await storageClient.putFile(bytes, () => {});
        const url = await storageClient.getDirectURL(hash);
        return url;
      } catch {
        // Fallback: compress to base64
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const MAX = 400;
              let w = img.width;
              let h = img.height;
              if (w > MAX || h > MAX) {
                if (w > h) {
                  h = Math.round((h * MAX) / w);
                  w = MAX;
                } else {
                  w = Math.round((w * MAX) / h);
                  h = MAX;
                }
              }
              const canvas = document.createElement("canvas");
              canvas.width = w;
              canvas.height = h;
              canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
              resolve(canvas.toDataURL("image/jpeg", 0.5));
            };
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = e.target?.result as string;
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });
      }
    }

    let compressedImages: string[] = [];
    if (imageFiles.length > 0) {
      try {
        setUploadProgress(0);
        for (let i = 0; i < imageFiles.length; i++) {
          const url = await uploadImageFile(imageFiles[i]);
          compressedImages.push(url);
          setUploadProgress(Math.round(((i + 1) / imageFiles.length) * 100));
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error(
          "Failed to upload image. Please try again or paste an image URL.",
        );
        setUploadProgress(null);
        setIsSubmitting(false);
        return;
      }
    } else if (productForm.imageUrl) {
      compressedImages = [productForm.imageUrl];
    }

    // Merge with existing images, excluding removed ones
    const existingImages = editingProduct
      ? editingProduct.images.filter(
          (img) => !removedExistingImages.includes(img),
        )
      : [];
    const finalImages =
      compressedImages.length > 0
        ? [...compressedImages, ...existingImages]
        : existingImages.length > 0
          ? existingImages
          : [imgLehenga];

    const base = {
      name: productForm.name,
      pricePerDay: Number(productForm.pricePerDay),
      depositAmount: Number(productForm.depositAmount),
      sizes: productForm.sizes.length ? productForm.sizes : ["Free Size"],
      occasions: productForm.occasions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      description: productForm.description,
      images: finalImages,
      rating: 4.5,
      reviewCount: 0,
      isAvailable: true,
      designerName: "",
      colors: [],
    };
    try {
      if (editingProduct) {
        await updateProduct({ ...base, id: editingProduct.id });
        toast.success("Product updated successfully!");
      } else {
        await addProduct({ ...base, id: `p${Date.now()}` });
        toast.success("Product added successfully!");
      }
      await fetchProducts();
      setProductDialogOpen(false);
      setImageFiles([]);
      setImagePreviews([]);
      setRemovedExistingImages([]);
      setUploadProgress(null);
    } catch (err) {
      console.error("Product save error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save product: ${msg.slice(0, 120)}`);
      setUploadProgress(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDeleteProduct() {
    if (deleteProductId) {
      try {
        await deleteProduct(deleteProductId);
        await fetchProducts();
        setDeleteProductId(null);
        toast.success("Product deleted.");
      } catch {
        toast.error("Failed to delete product. Please try again.");
      }
    }
  }

  // ── Coupon handlers ─────────────────────────────────────────────────────────────────────────
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

  // ── Review handlers ─────────────────────────────────────────────────────────────────────────
  function openAddReview() {
    setEditingReview(null);
    setReviewForm(emptyReviewForm);
    setReviewDialogOpen(true);
  }

  function openEditReview(r: AdminReview) {
    setEditingReview(r);
    setReviewForm({
      productId: r.productId,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
    });
    setReviewDialogOpen(true);
  }

  function submitReview() {
    if (!reviewForm.productId || !reviewForm.userName || !reviewForm.comment) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const product = adminProducts.find((p) => p.id === reviewForm.productId);
    const review: AdminReview = {
      id: editingReview ? editingReview.id : `rev${Date.now()}`,
      productId: reviewForm.productId,
      productName: product?.name ?? reviewForm.productId,
      userName: reviewForm.userName,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: editingReview
        ? editingReview.date
        : new Date().toLocaleDateString("en-IN"),
    };
    if (editingReview) {
      setAdminReviews((prev) =>
        prev.map((r) => (r.id === editingReview.id ? review : r)),
      );
      toast.success("Review updated successfully!");
    } else {
      setAdminReviews((prev) => [...prev, review]);
      toast.success("Review added successfully!");
    }
    setReviewDialogOpen(false);
  }

  function confirmDeleteReview() {
    if (deleteReviewId) {
      setAdminReviews((prev) => prev.filter((r) => r.id !== deleteReviewId));
      setDeleteReviewId(null);
      toast.success("Review deleted.");
    }
  }

  // ── CSV Export helpers ─────────────────────────────────────────────────────────────────────────────
  function exportUsers() {
    exportToCSV(
      "radhey-radhey-users",
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
      "radhey-radhey-bookings",
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
      "radhey-radhey-products",
      ["ID", "Name", "Price/Day", "Rating", "Available"],
      adminProducts.map((p) => [
        p.id,
        p.name,
        String(p.pricePerDay),
        String(p.rating),
        p.isAvailable ? "Yes" : "No",
      ]),
    );
    toast.success("Products exported to CSV.");
  }

  function exportCoupons() {
    exportToCSV(
      "radhey-radhey-coupons",
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

  // ── Stats ─────────────────────────────────────────────────────────────────────────────────────
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
        totalRevenue === 0
          ? "\u20b90"
          : `\u20b9${totalRevenue.toLocaleString("en-IN")}`,
      change:
        thisMonthRevenue > 0
          ? `+\u20b9${thisMonthRevenue.toLocaleString("en-IN")} this month`
          : "No revenue this month",
      icon: BarChart3,
      color: "bg-green-50 text-black",
    },
    {
      label: "Active Rentals",
      value: String(activeRentals),
      change: activeRentals > 0 ? `${activeRentals} ongoing` : "None ongoing",
      icon: ShoppingBag,
      color: "bg-blue-50 text-black",
    },
    {
      label: "Total Products",
      value: String(adminProducts.length),
      change: `${adminProducts.length} total`,
      icon: Package,
      color: "bg-purple-50 text-black",
    },
    {
      label: "Registered Users",
      value: String(registeredUsers.length),
      change: `${registeredUsers.length} registered`,
      icon: Users,
      color: "bg-amber-50 text-black",
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
    {
      id: "reviews",
      label: "Reviews",
      icon: MessageSquare,
      ocid: "admin.reviews.tab",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gray-900 text-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-700 rounded-lg flex items-center justify-center">
            <BarChart3 size={16} />
          </div>
          <div>
            <p className="font-semibold">
              Radhey Radhey Unique Collection Admin
            </p>
            <p className="text-xs text-black">Management Dashboard</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="text-sm text-black hover:text-black"
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
                  ? "bg-rose-700 text-black"
                  : "bg-white border border-gray-200 text-black hover:border-rose-400"
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
                  <p className="text-2xl font-bold text-black">{stat.value}</p>
                  <p className="text-sm text-black">{stat.label}</p>
                  <p className="text-xs text-black mt-1">{stat.change}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-black mb-4">Recent Bookings</h3>
              {bookings.length === 0 ? (
                <p
                  className="text-black text-sm"
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
                        <p className="text-sm font-medium text-black">
                          #{b.id}
                        </p>
                        <p className="text-xs text-black">
                          {b.items.length} item(s)
                        </p>
                      </div>
                      <p className="font-semibold text-black">
                        \u20b9{b.finalAmount.toLocaleString()}
                      </p>
                      <span className="text-xs bg-blue-100 text-black px-2 py-0.5 rounded-full capitalize">
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
              <h2 className="font-semibold text-black">
                Products ({adminProducts.length})
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid="admin.products.export_button"
                  onClick={exportProducts}
                  className="flex items-center gap-1.5 border border-gray-300 text-black px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:text-black transition-colors"
                >
                  <Download size={13} /> Export CSV
                </button>
                <button
                  type="button"
                  data-ocid="admin.products.open_modal_button"
                  onClick={openAddProduct}
                  className="flex items-center gap-2 bg-rose-700 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-800"
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" data-ocid="admin.products.table">
                  <thead className="bg-gray-50 text-xs text-black uppercase">
                    <tr>
                      <th className="text-left px-5 py-3">Product</th>
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
                          className="px-5 py-8 text-center text-black"
                          data-ocid="admin.products.empty_state"
                        >
                          No products yet. Add your first product.
                        </td>
                      </tr>
                    )}
                    {adminProducts.map((p, idx) => (
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
                            <span className="text-sm font-medium text-black">
                              {p.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm font-medium">
                          \u20b9{p.pricePerDay.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-sm">\u2605 {p.rating}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              data-ocid={`admin.products.edit_button.${idx + 1}`}
                              onClick={() => openEditProduct(p)}
                              className="p-1.5 text-black hover:text-black"
                              title="Edit product"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              data-ocid={`admin.products.delete_button.${idx + 1}`}
                              onClick={() => setDeleteProductId(p.id)}
                              className="p-1.5 text-black hover:text-black"
                              title="Delete product"
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
          </div>
        )}

        {/* Bookings */}
        {activeTab === "bookings" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-black">All Bookings</h2>
              <button
                type="button"
                data-ocid="admin.bookings.export_button"
                onClick={exportBookings}
                className="flex items-center gap-1.5 border border-gray-300 text-black px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:text-black transition-colors"
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {bookings.length === 0 ? (
                <div
                  className="p-12 text-center text-black"
                  data-ocid="admin.bookings.empty_state"
                >
                  <p>No bookings yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full" data-ocid="admin.bookings.table">
                    <thead className="bg-gray-50 text-xs text-black uppercase">
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
                          <td className="px-5 py-3 text-sm font-medium text-black">
                            #{b.id}
                          </td>
                          <td className="px-5 py-3 text-sm text-black">
                            {b.items.length} item(s)
                          </td>
                          <td className="px-5 py-3 text-sm font-semibold">
                            \u20b9{b.finalAmount.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-sm text-black">
                            {new Date(b.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-xs bg-blue-100 text-black px-2 py-0.5 rounded-full capitalize">
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
              <h2 className="font-semibold text-black">
                Users ({registeredUsers.length})
              </h2>
              <button
                type="button"
                data-ocid="admin.users.export_button"
                onClick={exportUsers}
                className="flex items-center gap-1.5 border border-gray-300 text-black px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:text-black transition-colors"
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {registeredUsers.length === 0 ? (
                <div
                  className="p-12 text-center text-black"
                  data-ocid="admin.users.empty_state"
                >
                  <p>No users have logged in yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full" data-ocid="admin.users.table">
                    <thead className="bg-gray-50 text-xs text-black uppercase">
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
                                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-black text-xs font-bold">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-black">
                                  {u.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-sm text-black">
                              {u.email}
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  u.role === "admin"
                                    ? "bg-rose-100 text-black"
                                    : "bg-gray-100 text-black"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-sm text-black font-medium">
                              {u.loginCount}
                            </td>
                            <td className="px-5 py-3 text-sm text-black">
                              {new Date(u.lastLoginAt).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </td>
                            <td className="px-5 py-3">
                              {isOnline ? (
                                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-black px-2 py-0.5 rounded-full font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                                  Online
                                </span>
                              ) : (
                                <span className="text-xs text-black">
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
              <h2 className="font-semibold text-black">Coupon Codes</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid="admin.coupons.export_button"
                  onClick={exportCoupons}
                  className="flex items-center gap-1.5 border border-gray-300 text-black px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:text-black transition-colors"
                >
                  <Download size={13} /> Export CSV
                </button>
                <button
                  type="button"
                  data-ocid="admin.coupons.open_modal_button"
                  onClick={openAddCoupon}
                  className="flex items-center gap-2 bg-rose-700 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-800"
                >
                  <Plus size={16} /> Add Coupon
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full" data-ocid="admin.coupons.table">
                <thead className="bg-gray-50 text-xs text-black uppercase">
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
                        className="px-5 py-8 text-center text-black"
                        data-ocid="admin.coupons.empty_state"
                      >
                        No coupons yet.
                      </td>
                    </tr>
                  )}
                  {adminCoupons.map((c, i) => (
                    <tr key={c.code} data-ocid={`admin.coupons.row.${i + 1}`}>
                      <td className="px-5 py-3 font-mono font-bold text-sm text-black">
                        {c.code}
                      </td>
                      <td className="px-5 py-3 text-sm text-black">{c.type}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-black">
                        {c.value}
                      </td>
                      <td className="px-5 py-3 text-sm text-black">
                        {c.uses}/{c.maxUses}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            c.status === "Active"
                              ? "bg-green-100 text-black"
                              : "bg-gray-100 text-black"
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
                            className="p-1.5 text-black hover:text-black"
                            title="Edit coupon"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            data-ocid={`admin.coupons.delete_button.${i + 1}`}
                            onClick={() => setDeleteCouponCode(c.code)}
                            className="p-1.5 text-black hover:text-black"
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

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-black">
                Customer Reviews ({adminReviews.length})
              </h2>
              <button
                type="button"
                onClick={openAddReview}
                className="flex items-center gap-2 bg-rose-700 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-800"
              >
                <Plus size={16} /> Add Review
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {adminReviews.length === 0 ? (
                <div className="p-12 text-center text-black">
                  <MessageSquare
                    size={40}
                    className="mx-auto mb-3 text-gray-300"
                  />
                  <p className="font-medium text-black mb-1">No reviews yet.</p>
                  <p className="text-sm text-gray-500">
                    Add a review to display on product pages.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-xs text-black uppercase">
                      <tr>
                        <th className="text-left px-5 py-3">Product</th>
                        <th className="text-left px-5 py-3">Reviewer</th>
                        <th className="text-left px-5 py-3">Rating</th>
                        <th className="text-left px-5 py-3">Comment</th>
                        <th className="text-left px-5 py-3">Date</th>
                        <th className="text-left px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {adminReviews.map((r, _i) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 text-sm font-medium text-black">
                            {r.productName}
                          </td>
                          <td className="px-5 py-3 text-sm text-black">
                            {r.userName}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }, (_, j) => j).map(
                                (j) => (
                                  <Star
                                    key={j}
                                    size={12}
                                    className={
                                      j < r.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-gray-300"
                                    }
                                  />
                                ),
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-black max-w-xs truncate">
                            {r.comment}
                          </td>
                          <td className="px-5 py-3 text-sm text-black">
                            {r.date}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => openEditReview(r)}
                                className="p-1.5 text-black hover:text-rose-700"
                                title="Edit review"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteReviewId(r.id)}
                                className="p-1.5 text-black hover:text-red-600"
                                title="Delete review"
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
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Product Add/Edit Dialog ── */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto bg-white text-gray-900 border border-gray-200 shadow-2xl"
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
                  onChange={(e) => {
                    setProductForm((f) => ({ ...f, name: e.target.value }));
                    if (productFormErrors.name)
                      setProductFormErrors((prev) => ({
                        ...prev,
                        name: undefined,
                      }));
                  }}
                  placeholder="e.g. Crimson Bridal Lehenga"
                />
                {productFormErrors.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {productFormErrors.name}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="prod-price">Price Per Day (₹) *</Label>
                <Input
                  id="prod-price"
                  type="number"
                  min="0"
                  data-ocid="admin.products.input"
                  value={productForm.pricePerDay}
                  onChange={(e) => {
                    setProductForm((f) => ({
                      ...f,
                      pricePerDay: e.target.value,
                    }));
                    if (productFormErrors.pricePerDay)
                      setProductFormErrors((prev) => ({
                        ...prev,
                        pricePerDay: undefined,
                      }));
                  }}
                  placeholder="e.g. 2500"
                  className="bg-white text-black border-gray-300"
                />
                {productFormErrors.pricePerDay && (
                  <p className="text-xs text-red-600 mt-1">
                    {productFormErrors.pricePerDay}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="prod-deposit">Deposit Amount (₹)</Label>
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
                  placeholder="e.g. 5000"
                  className="bg-white text-black border-gray-300"
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
                        ? "bg-rose-700 text-black border-rose-700"
                        : "border-gray-300 text-black hover:border-rose-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
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
              Product Images{" "}
              {!editingProduct && <span className="text-black">*</span>}
            </Label>

            {/* Existing images when editing */}
            {editingProduct &&
              editingProduct.images.filter(
                (img) => !removedExistingImages.includes(img),
              ).length > 0 &&
              imagePreviews.length === 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    Current images — click ✕ to remove
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {editingProduct.images
                      .filter((img) => !removedExistingImages.includes(img))
                      .map((img) => (
                        <div key={img} className="relative group">
                          <img
                            src={img}
                            alt="Product"
                            className="w-full h-24 object-cover rounded-lg shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setRemovedExistingImages((prev) => [...prev, img])
                            }
                            className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* New image previews grid */}
            {imagePreviews.length > 0 && (
              <div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {imagePreviews.map((preview, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: preview order is stable
                    <div key={i} className="relative group">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFiles((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          );
                          setImagePreviews((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          );
                        }}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                {/* Add more images button */}
                <label
                  htmlFor="prod-image-upload"
                  data-ocid="admin.product.dropzone"
                  className="flex items-center gap-2 border border-dashed border-rose-300 rounded-lg px-3 py-2 text-sm text-rose-700 cursor-pointer hover:bg-rose-50 transition-colors"
                >
                  <ImageIcon size={14} />
                  Add more images
                  <input
                    ref={fileInputRef}
                    id="prod-image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    data-ocid="admin.product.upload_button"
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files ?? []);
                      setImageFiles((prev) => [...prev, ...newFiles]);
                      setImagePreviews((prev) => [
                        ...prev,
                        ...newFiles.map((f) => URL.createObjectURL(f)),
                      ]);
                      setUploadProgress(null);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            )}

            {/* Initial dropzone (no previews yet) */}
            {imagePreviews.length === 0 && (
              <label
                htmlFor="prod-image-upload"
                data-ocid="admin.product.dropzone"
                className="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors block border-gray-300 hover:border-rose-400 hover:bg-rose-50/30"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const newFiles = Array.from(e.dataTransfer.files).filter(
                    (f) => f.type.startsWith("image/"),
                  );
                  if (newFiles.length > 0) {
                    setImageFiles((prev) => [...prev, ...newFiles]);
                    setImagePreviews((prev) => [
                      ...prev,
                      ...newFiles.map((f) => URL.createObjectURL(f)),
                    ]);
                    setUploadProgress(null);
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  id="prod-image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  data-ocid="admin.product.upload_button"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files ?? []);
                    setImageFiles((prev) => [...prev, ...newFiles]);
                    setImagePreviews((prev) => [
                      ...prev,
                      ...newFiles.map((f) => URL.createObjectURL(f)),
                    ]);
                    setUploadProgress(null);
                    e.target.value = "";
                  }}
                />
                <div className="space-y-2 py-4">
                  <div className="mx-auto w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-black" />
                  </div>
                  <p className="text-sm font-medium text-black">
                    Click to upload or drag & drop multiple images
                  </p>
                  <p className="text-xs text-black">
                    PNG, JPG, WEBP — select multiple
                  </p>
                </div>
              </label>
            )}

            {uploadProgress !== null && (
              <div
                data-ocid="admin.product.loading_state"
                className="space-y-1"
              >
                <div className="flex justify-between text-xs text-black">
                  <span>Processing images…</span>
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
              className="bg-rose-700 hover:bg-rose-800 text-black"
              disabled={
                isSubmitting ||
                (uploadProgress !== null && uploadProgress < 100)
              }
            >
              {isSubmitting
                ? "Saving..."
                : editingProduct
                  ? "Save Changes"
                  : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Product Delete Confirm ── */}
      <Dialog
        open={!!deleteProductId}
        onOpenChange={(open) => !open && setDeleteProductId(null)}
      >
        <DialogContent
          className="bg-white text-gray-900 border border-gray-200 shadow-2xl"
          data-ocid="admin.products.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-black">
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
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto bg-white text-gray-900 border border-gray-200 shadow-2xl"
          data-ocid="admin.coupons.dialog"
        >
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
                <SelectContent className="bg-white text-black">
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
              className="bg-rose-700 hover:bg-rose-800 text-black"
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
        <DialogContent
          className="bg-white text-gray-900 border border-gray-200 shadow-2xl"
          data-ocid="admin.coupons.delete_button"
        >
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-black">
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

      {/* ── Review Add/Edit Dialog ── */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-lg bg-white text-gray-900 border border-gray-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingReview ? "Edit Review" : "Add New Review"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="review-product">Product *</Label>
              <select
                id="review-product"
                value={reviewForm.productId}
                onChange={(e) =>
                  setReviewForm((f) => ({ ...f, productId: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black bg-white focus:outline-none focus:border-rose-400"
              >
                <option value="">Select a product</option>
                {adminProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="review-username">Reviewer Name *</Label>
              <Input
                id="review-username"
                value={reviewForm.userName}
                onChange={(e) =>
                  setReviewForm((f) => ({ ...f, userName: e.target.value }))
                }
                placeholder="e.g. Priya Sharma"
              />
            </div>
            <div>
              <Label>Rating *</Label>
              <div className="flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReviewForm((f) => ({ ...f, rating: r }))}
                    className={`w-9 h-9 rounded-full border font-bold text-sm transition-colors ${
                      reviewForm.rating >= r
                        ? "bg-amber-400 border-amber-400 text-black"
                        : "border-gray-300 text-black hover:border-amber-400"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review-comment">Comment *</Label>
              <Textarea
                id="review-comment"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((f) => ({ ...f, comment: e.target.value }))
                }
                placeholder="Write the review..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              className="bg-rose-700 hover:bg-rose-800 text-black"
            >
              {editingReview ? "Save Changes" : "Add Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Review Delete Confirm ── */}
      <Dialog
        open={!!deleteReviewId}
        onOpenChange={(open) => !open && setDeleteReviewId(null)}
      >
        <DialogContent className="bg-white text-gray-900 border border-gray-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-black">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteReviewId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteReview}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
