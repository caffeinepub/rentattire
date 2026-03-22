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
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Wishlist from "./pages/Wishlist";

interface RouteState {
  page: string;
  params: Record<string, string>;
}

export default function App() {
  const [route, setRoute] = useState<RouteState>({ page: "home", params: {} });

  const navigate = (page: string, params: Record<string, string> = {}) => {
    setRoute({ page, params });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle hash-based navigation for Stripe redirect
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "checkout-success") {
      setRoute({ page: "checkout-success", params: {} });
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
