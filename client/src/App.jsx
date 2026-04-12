import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";
import Landing    from "./pages/Landing";
import Login      from "./pages/Login";
import Signup     from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import HomePage   from "./pages/HomePage";
import Profile    from "./pages/Profile";
import MyBooks    from "./pages/MyBooks";
import BookDetail from "./pages/BookDetail";
import BuyBook    from "./pages/Buybook";
import AuthorPage from "./pages/AuthorPage";
import GenrePage  from "./pages/GenrePage";
import GenreBooks from "./pages/GenreBooks";
import ConditionBooks from "./pages/ConditionBooks";
import SellBook   from "./pages/Sellbook";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminBooks from "./pages/AdminBooks";
import AdminTransactions from "./pages/AdminTransactions";
import AdminAuthors from "./pages/AdminAuthors";
import AdminReports from "./pages/AdminReports";

export default function App() {
  const [authState, setAuthState] = useState("loading"); // "loading" | "admin" | "user" | "guest"
  const [cart,     setCart]     = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Check session on mount and on auth state changes
    const checkSession = async (session) => {
      if (!session) {
        setAuthState("guest");
        return;
      }
      // Check if admin via role column in profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role === "admin") {
        setAuthState("admin");
      } else {
        // Also check admin_roles table as fallback
        const { data: adminRole } = await supabase
          .from("admin_roles")
          .select("id")
          .eq("user_id", session.user.id)
          .maybeSingle();
        setAuthState(adminRole ? "admin" : "user");
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkSession(session);
    });

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToCart          = (book) => setCart(prev     => prev.find(b => b.id === book.id) ? prev : [...prev, book]);
  const removeFromCart     = (id)   => setCart(prev     => prev.filter(b => b.id !== id));
  const addToWishlist      = (book) => setWishlist(prev => prev.find(b => b.id === book.id) ? prev : [...prev, book]);
  const removeFromWishlist = (id)   => setWishlist(prev => prev.filter(b => b.id !== id));

  const handleLogin  = () => {}; // auth state is now driven by onAuthStateChange
  const handleLogout = async () => {
    setCart([]);
    setWishlist([]);
    await supabase.auth.signOut();
    // onAuthStateChange will fire with null session → sets authState to "guest"
    // Navigation is handled by the guest redirect in routes
    window.location.href = "/";
  };

  const isLoggedIn = authState === "user" || authState === "admin";
  const sharedProps = { isLoggedIn, onLogout: handleLogout, cart, wishlist, addToCart, removeFromCart, addToWishlist, removeFromWishlist };

  // While checking session, show nothing (avoids flash-redirect)
  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-blue-400 text-lg">Loading...</div>
      </div>
    );
  }

  // Route guards
  const requireAuth  = (el) => isLoggedIn ? el : <Navigate to="/login" replace />;
  const requireAdmin = (el) => authState === "admin" ? el : isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Landing    {...sharedProps} />} />
        <Route path="/login"       element={<Login      onLogin={handleLogin} />} />
        <Route path="/signup"      element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home"        element={requireAuth(<HomePage   {...sharedProps} />)} />
        <Route path="/browse"      element={requireAuth(<HomePage   {...sharedProps} />)} />
        <Route path="/profile"     element={requireAuth(<Profile    {...sharedProps} />)} />
        <Route path="/my-books"    element={requireAuth(<MyBooks    {...sharedProps} />)} />
        <Route path="/books/:id"   element={requireAuth(<BookDetail {...sharedProps} />)} />
        <Route path="/buybook/:id" element={requireAuth(<BuyBook    {...sharedProps} />)} />
        <Route path="/author/:id"  element={requireAuth(<AuthorPage {...sharedProps} />)} />
        <Route path="/genre/:name" element={requireAuth(<GenrePage  {...sharedProps} />)} />
        <Route path="/genre-books/:genre" element={requireAuth(<GenreBooks {...sharedProps} />)} />
        <Route path="/condition/:condition" element={requireAuth(<ConditionBooks {...sharedProps} />)} />
        <Route path="/sellbook"    element={requireAuth(<SellBook   {...sharedProps} />)} />
        <Route path="/admin"             element={requireAdmin(<AdminDashboard {...sharedProps} />)} />
        <Route path="/admin/users"       element={requireAdmin(<AdminUsers     {...sharedProps} />)} />
        <Route path="/admin/books"       element={requireAdmin(<AdminBooks     {...sharedProps} />)} />
        <Route path="/admin/authors"     element={requireAdmin(<AdminAuthors   {...sharedProps} />)} />
        <Route path="/admin/transactions" element={requireAdmin(<AdminTransactions {...sharedProps} />)} />
        <Route path="/admin/reports"     element={requireAdmin(<AdminReports   {...sharedProps} />)} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}