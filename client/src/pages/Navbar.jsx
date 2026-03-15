import { useNavigate } from "react-router-dom";

export default function Navbar({ isprofile }) {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center px-10 py-5 shadow-sm">
        <h1 onClick={() => navigate("/")} className="text-2xl font-bold text-indigo-600 cursor-pointer hover:text-indigo-700">
            PowerXchange
        </h1>
      <div className="flex gap-4">
        <button onClick={() => navigate("/Login")} className="text-gray-600 hover:text-indigo-600 font-medium">Login</button>
        <button onClick={() => navigate("/signup")} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Sign Up</button>
        
        {!isprofile && <button onClick={() => navigate("/profile")} className="text-gray-600 hover:text-indigo-600 font-medium">My Profile</button>}
      </div>
    </nav>
  );
}