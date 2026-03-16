import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import BookDetail from "./pages/BookDetail";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ add this

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup onSignup={() => setIsLoggedIn(true)} />} />
        <Route path="/login"  element={<Login  onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/home"   element={<HomePage isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />} />
        <Route path="/book/:id" element={<BookDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;