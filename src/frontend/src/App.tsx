import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import Categories from "./pages/Categories";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import FAQ from "./pages/FAQ";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import RentalTerms from "./pages/RentalTerms";
import Wishlist from "./pages/Wishlist";
import { useStore } from "./store/useStore";

interface RouteState {
  page: string;
  params: Record<string, string>;
}

export default function App() {
  const [route, setRoute] = useState<RouteState>({ page: "home", params: {} });
  const fetchProducts = useStore((s) => s.fetchProducts);

  // Fetch products from backend on startup so all users see the same catalog
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const navigate = (page: string, params: Record<string, string> = {}) => {
    setRoute({ page, params });
    window.scrollTo({ top: 0, behavior: "smooth" });
    const path = page === "home" ? "/" : `/${page}`;
    window.history.pushState({}, "", path);
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const path = window.location.pathname.replace(/^\//, "").toLowerCase();

    if (hash === "checkout-success") {
      setRoute({ page: "checkout-success", params: {} });
    } else if (path === "login") {
      setRoute({ page: "login", params: {} });
    } else if (path === "admin") {
      setRoute({ page: "login", params: {} });
    } else if (path === "faq") {
      setRoute({ page: "faq", params: {} });
    } else if (path === "rental-terms") {
      setRoute({ page: "rental-terms", params: {} });
    }
  }, []);

  const noFooterPages = ["admin", "login"];
  const noHeaderPages = ["admin", "home"];

  const renderPage = () => {
    switch (route.page) {
      case "home":
        return <Home onNavigate={navigate} />;
      case "categories":
        return <Categories onNavigate={navigate} />;
      case "products":
        return (
          <Products
            onNavigate={navigate}
            initialCategory={route.params.category}
            initialSearch={route.params.search}
          />
        );
      case "product-detail":
        return (
          <ProductDetail
            productId={route.params.id || ""}
            onNavigate={navigate}
          />
        );
      case "cart":
        return <Cart onNavigate={navigate} />;
      case "wishlist":
        return <Wishlist onNavigate={navigate} />;
      case "checkout":
        return <Checkout onNavigate={navigate} />;
      case "checkout-success":
        return <CheckoutSuccess onNavigate={navigate} />;
      case "login":
        return <Login onNavigate={navigate} />;
      case "dashboard":
        return <Dashboard onNavigate={navigate} />;
      case "admin":
        return <Admin onNavigate={navigate} />;
      case "contact":
        return <Contact />;
      case "faq":
        return <FAQ onNavigate={navigate} />;
      case "rental-terms":
        return <RentalTerms onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!noHeaderPages.includes(route.page) && (
        <Header currentPage={route.page} onNavigate={navigate} />
      )}
      <main className="flex-1">{renderPage()}</main>
      {!noFooterPages.includes(route.page) && <Footer onNavigate={navigate} />}
    </div>
  );
}
