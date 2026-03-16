import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ── Dummy Data ────────────────────────────────────────────────────────────────
const BOOKS = [
  {
    id: "1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    price: 299,
    listingType: "rent",
    condition: "good",
    genre: "Computer Science",
    description:
      "A comprehensive introduction to modern algorithms. Covers sorting, searching, graph algorithms, dynamic programming and more. Some pencil markings on pages 40–60, otherwise in great shape. Perfect for CS students preparing for placements or competitive programming.",
    imageUrl: "https://covers.openlibrary.org/b/id/8739161-L.jpg",
    available: true,
    rentedTillNow: 6,         // number of times rented
    avgReadingTime: "3 weeks", // average reading time
    avgRentingTime: "4 weeks", // average renting duration
    seller: {
      name: "Arjun Sharma",
      college: "NIT Surathkal",
      rating: 4.5,
      totalRatings: 12,
    },
    relatedBooks: [
      { id: "2", title: "Clean Code", author: "Robert C. Martin", price: 199, imageUrl: "https://covers.openlibrary.org/b/id/8432472-L.jpg" },
      { id: "3", title: "The Pragmatic Programmer", author: "Andy Hunt", price: 249, imageUrl: "https://covers.openlibrary.org/b/id/8261165-L.jpg" },
      { id: "4", title: "Structure & Interpretation", author: "Abelson & Sussman", price: 179, imageUrl: "https://covers.openlibrary.org/b/id/8408476-L.jpg" },
    ],
    feedback: [
      { id: 1, user: "Sneha R.", college: "PESIT Bangalore", rating: 5, comment: "Book was in excellent condition, seller was very responsive. Would rent again!", date: "Jan 2025" },
      { id: 2, user: "Karthik M.", college: "NITK Surathkal", rating: 4, comment: "Good condition as described. Delivery was a bit delayed but overall great experience.", date: "Dec 2024" },
      { id: 3, user: "Divya P.", college: "RV College", rating: 5, comment: "Perfect for exam prep. The pencil marks actually helped understand key sections!", date: "Nov 2024" },
    ],
  },
  {
    id: "2",
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 199,
    listingType: "sell",
    condition: "new",
    genre: "Software Engineering",
    description:
      "Like new condition. Only read once. A handbook of agile software craftsmanship — perfect for anyone learning to write maintainable, readable code.",
    imageUrl: "https://covers.openlibrary.org/b/id/8432472-L.jpg",
    available: true,
    rentedTillNow: 3,
    avgReadingTime: "2 weeks",
    avgRentingTime: "3 weeks",
    seller: {
      name: "Priya Nair",
      college: "RVCE Bangalore",
      rating: 5.0,
      totalRatings: 8,
    },
    relatedBooks: [
      { id: "1", title: "Introduction to Algorithms", author: "Thomas H. Cormen", price: 299, imageUrl: "https://covers.openlibrary.org/b/id/8739161-L.jpg" },
      { id: "3", title: "The Pragmatic Programmer", author: "Andy Hunt", price: 249, imageUrl: "https://covers.openlibrary.org/b/id/8261165-L.jpg" },
    ],
    feedback: [
      { id: 1, user: "Rahul V.", college: "BMS College", rating: 5, comment: "Absolutely like new. Seller was very professional.", date: "Feb 2025" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function StarRating({ rating, size = "sm" }) {
  const s = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`${s} ${star <= Math.round(rating) ? "text-amber-400" : "text-stone-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

const CONDITION_STYLES = {
  new:        { label: "New",        classes: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  good:       { label: "Good",       classes: "bg-sky-100 text-sky-700 border-sky-200" },
  acceptable: { label: "Acceptable", classes: "bg-amber-100 text-amber-700 border-amber-200" },
};

function StatCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-white border border-stone-100 rounded-xl p-4 flex-1 text-center shadow-sm">
      <span className="text-2xl">{icon}</span>
      <span className="text-lg font-bold text-stone-800">{value}</span>
      <span className="text-xs text-stone-400 leading-tight">{label}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find book — later replace with: fetch(`/books/${id}`)
  const book = BOOKS.find((b) => b.id === id) ?? BOOKS[0];

  const [wishlisted, setWishlisted] = useState(false);
  const [inCart, setInCart]         = useState(false);

  const conditionStyle = CONDITION_STYLES[book.condition] ?? CONDITION_STYLES.acceptable;

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-stone-800" style={{ fontFamily: "'Georgia', serif" }}>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-stone-400 hover:text-stone-700 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to listings
        </button>
        <span className="text-xl font-bold tracking-tight text-stone-900">PowerXchange</span>
        <div className="w-28" />
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-12">

        {/* ── TOP SECTION: Cover + Details ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Book Cover */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-[280px] rounded-2xl overflow-hidden shadow-xl border border-stone-100 bg-white">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full object-cover"
                onError={(e) => { e.target.src = "https://placehold.co/280x400?text=No+Cover"; }}
              />
            </div>

            {/* Availability pill */}
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${book.available ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
              {book.available ? "✓ Available Now" : "✗ Not Available"}
            </span>
          </div>

          {/* Right: All Details */}
          <div className="flex flex-col gap-5">

            {/* Title & Author */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${conditionStyle.classes}`}>
                  {conditionStyle.label}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-500 border border-stone-200">
                  {book.genre}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${book.listingType === "sell" ? "bg-violet-100 text-violet-700" : "bg-teal-100 text-teal-700"}`}>
                  {book.listingType === "sell" ? "For Sale" : "For Rent"}
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-snug text-stone-900">{book.title}</h1>
              <p className="text-stone-400 mt-1">by <span className="text-stone-600">{book.author}</span></p>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-stone-900">
              ₹{book.price}
              {book.listingType === "rent" && (
                <span className="text-sm font-normal text-stone-400 ml-2">/ semester</span>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">About this copy</h2>
              <p className="text-stone-600 text-sm leading-relaxed">{book.description}</p>
            </div>

            {/* Stats row */}
            <div className="flex gap-3">
              <StatCard icon="🔄" label="Times Rented" value={book.rentedTillNow} />
              <StatCard icon="📖" label="Avg Reading Time" value={book.avgReadingTime} />
              <StatCard icon="📅" label="Avg Renting Time" value={book.avgRentingTime} />
            </div>

            {/* Seller */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-lg">
                  {book.seller.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{book.seller.name}</p>
                  <p className="text-xs text-stone-400">{book.seller.college}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <StarRating rating={book.seller.rating} />
                    <span className="text-xs text-stone-400">({book.seller.totalRatings})</span>
                  </div>
                </div>
              </div>
              <button className="text-sm text-violet-600 hover:text-violet-800 font-medium transition-colors">
                View profile →
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={() => setInCart((v) => !v)}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${inCart ? "bg-stone-800 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}
              >
                {inCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setWishlisted((v) => !v)}
                  className={`py-3 rounded-xl font-semibold text-sm border transition-all duration-200 ${wishlisted ? "border-rose-400 text-rose-500 bg-rose-50" : "border-stone-300 text-stone-600 hover:border-rose-300 hover:text-rose-400"}`}
                >
                  {wishlisted ? "♥ Wishlisted" : "♡ Wishlist"}
                </button>
                <button className="py-3 rounded-xl font-semibold text-sm border border-stone-300 text-stone-600 hover:border-violet-300 hover:text-violet-600 transition-all duration-200">
                  💬 Contact Seller
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEEDBACK SECTION ── */}
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-5">
            Reader Feedback
            <span className="ml-2 text-sm font-normal text-stone-400">({book.feedback.length} reviews)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {book.feedback.map((fb) => (
              <div key={fb.id} className="bg-white border border-stone-100 rounded-xl p-5 shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-sm">
                      {fb.user[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 text-sm">{fb.user}</p>
                      <p className="text-xs text-stone-400">{fb.college}</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-300">{fb.date}</span>
                </div>
                <StarRating rating={fb.rating} size="sm" />
                <p className="text-stone-600 text-sm leading-relaxed">"{fb.comment}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── RELATED BOOKS ── */}
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-5">Related Books</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {book.relatedBooks.map((rb) => (
              <div
                key={rb.id}
                onClick={() => navigate(`/books/${rb.id}`)}
                className="bg-white border border-stone-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="h-40 overflow-hidden bg-stone-50">
                  <img
                    src={rb.imageUrl}
                    alt={rb.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = "https://placehold.co/160x160?text=Book"; }}
                  />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-stone-800 text-sm leading-snug line-clamp-2">{rb.title}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{rb.author}</p>
                  <p className="text-sm font-bold text-stone-700 mt-1.5">₹{rb.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
