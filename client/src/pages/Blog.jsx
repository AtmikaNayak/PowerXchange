import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const posts = [
  {
    tag: "Tips",
    title: "How to Price Your Textbook Right",
    excerpt: "Pricing too high means it sits unsold. Pricing too low leaves money on the table. Here's a simple framework for finding the sweet spot.",
    date: "Jan 12, 2025",
    readTime: "3 min read",
    emoji: "💰"
  },
  {
    tag: "Guide",
    title: "The Student's Guide to Buying Second-Hand Books",
    excerpt: "What to check before you buy, how to assess condition honestly, and how to avoid common pitfalls in peer-to-peer book transactions.",
    date: "Jan 8, 2025",
    readTime: "5 min read",
    emoji: "📖"
  },
  {
    tag: "Community",
    title: "Why Book Exchange Is the Smartest Thing You Can Do This Semester",
    excerpt: "Exchange — not sell, not buy — is the most underrated feature on PowerXchange. Here's why trading books with classmates is a win for everyone.",
    date: "Dec 28, 2024",
    readTime: "4 min read",
    emoji: "🔄"
  },
  {
    tag: "Tips",
    title: "5 Things to Do Before Listing Your Book",
    excerpt: "A good photo, honest condition rating, and the right genre tag can make the difference between a fast sale and a listing that sits for weeks.",
    date: "Dec 20, 2024",
    readTime: "3 min read",
    emoji: "✅"
  },
  {
    tag: "Story",
    title: "From Pile of Books to ₹2000: A Student's Experience",
    excerpt: "One student cleared out an entire semester's worth of textbooks in two weeks. We asked how they did it and what they'd do differently.",
    date: "Dec 14, 2024",
    readTime: "6 min read",
    emoji: "🎓"
  },
  {
    tag: "Platform",
    title: "What's New on PowerXchange",
    excerpt: "Wishlist, notifications, trending books, and more — here's a roundup of everything we've shipped recently and what's coming next.",
    date: "Dec 5, 2024",
    readTime: "4 min read",
    emoji: "🚀"
  },
];

const tagColors = {
  Tips: "bg-cyan-100 text-cyan-700",
  Guide: "bg-blue-100 text-blue-700",
  Community: "bg-purple-100 text-purple-700",
  Story: "bg-green-100 text-green-700",
  Platform: "bg-orange-100 text-orange-700",
};

export default function Blog({ isLoggedIn, onLogout, cart, wishlist }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} cart={cart} wishlist={wishlist} />

      <div className="max-w-4xl mx-auto px-6 py-12 pb-20">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 text-sm mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="font-serif font-black text-4xl text-blue-950 mb-2">Blog</h1>
        <p className="text-slate-400 text-sm mb-10">Tips, stories, and updates from the PowerXchange team.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post, i) => (
            <div key={i}
              className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <div className="text-4xl mb-4">{post.emoji}</div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${tagColors[post.tag]}`}>
                  {post.tag}
                </span>
                <span className="text-xs text-slate-400">{post.readTime}</span>
              </div>
              <h2 className="font-bold text-blue-950 text-lg leading-snug mb-2">{post.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              <p className="text-xs text-slate-400">{post.date}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-blue-950 to-blue-800 rounded-2xl p-8 text-center">
          <p className="font-serif font-bold text-white text-xl mb-1">Want to write for us?</p>
          <p className="text-blue-300 text-sm mb-5">Share your student story, tips, or experience with the PowerXchange community.</p>
          <div className="flex flex-col items-center gap-2">
            {["atmikanayak021206@gmail.com", "jatharva1701@gmail.com", "aakankshakpoojari265@gmail.com"].map(email => (
              <a key={email} href={`mailto:${email}?subject=Blog Contribution`} className="text-cyan-300 hover:text-white text-sm transition-colors">{email}</a>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}