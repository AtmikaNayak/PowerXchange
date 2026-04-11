import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // First check if user already exists
    const { data: existingUser } = await supabase.auth.getUser();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, college, usn: '' }
      }
    });

    if (authError) {
      // Handle "user already registered" error
      if (authError.message.includes("User already registered") || authError.message.includes("already been registered")) {
        setError("This email is already registered. Please login instead.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    // Create profile manually (use upsert to handle duplicates)
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: name,
          email: email,
          college: college,
          role: 'user',
          status: 'pending'
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        if (profileError.message.includes("foreign key")) {
          setError("This email is already registered. Please login instead.");
        } else {
          setError('Database error: ' + profileError.message);
        }
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Check your email!</h2>
          <p className="text-gray-500 text-sm mb-6">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account then login.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-indigo-600 mb-2">PowerXchange</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Create your account</h2>
        <p className="text-gray-500 text-sm mb-6">Join thousands of students exchanging books</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">College Email</label>
            <input
              type="email"
              placeholder="yourname@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">College Name</label>
            <input
              type="text"
              placeholder="Enter your college name"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;