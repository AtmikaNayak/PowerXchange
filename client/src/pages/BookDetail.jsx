import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { BOOKS, AUTHORS } from "./HomePage";
import Footer from "./Footer";

function StarRating({ rating, size = "sm" }) {
  const s = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`${s} ${star <= Math.round(rating) ? "text-amber-400" : "text-blue-100"}`}
          fill="currentColor" viewBox="0 0 20 20">
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
    <div className="flex flex-col items-center gap-1 bg-white border border-blue-100 rounded-xl p-4 flex-1 text-center shadow-sm">
      <span className="text-2xl">{icon}</span>
      <span className="text-xl font-bold text-blue-950">{value}</span>
      <span className="text-sm text-slate-400 leading-tight">{label}</span>
    </div>
  );
}

export default function BookDetail({ isLoggedIn, onLogout, cart, wishlist, addToCart, removeFromCart, addToWishlist, removeFromWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const book   = BOOKS.find((b) => b.id === id) ?? BOOKS[0];
  const author = book.authorId ? AUTHORS.find((a) => a.id === book.authorId) : null;

  const inCart      = cart?.find(b => b.id === book.id);
  const inWishlist  = wishlist?.find(b => b.id === book.id);

  const conditionStyle = CONDITION_STYLES[book.condition] ?? CONDITION_STYLES.acceptable;

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} cart={cart} wishlist={wishlist} />

      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-base mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pb-16 flex flex-col gap-12">

        {/* ── Cover + Details ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Cover */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-[260px] rounded-2xl overflow-hidden shadow-xl border border-blue-100 bg-white">
              <img src={book.imageUrl} alt={book.title} className="w-full object-cover"
                onError={(e) => { e.target.src = "https://placehold.co/260x380?text=No+Cover"; }} />
            </div>
            <span className={`px-4 py-1.5 rounded-full text-base font-semibold ${book.available ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
              {book.available ? "✓ Available Now" : "✗ Not Available"}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            {/* Badges */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider border ${conditionStyle.classes}`}>
                  {conditionStyle.label}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  {book.genre}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${
                  book.listingType === "sell" ? "bg-violet-100 text-violet-700" : "bg-teal-100 text-teal-700"
                }`}>
                  {book.listingType === "sell" ? "For Sale" : "For Rent"}
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-snug text-blue-950">{book.title}</h1>
              <p className="text-slate-400 mt-1 text-base">
                by{" "}
                {author ? (
                  <span onClick={() => navigate(`/author/${author.id}`)}
                    className="text-blue-600 cursor-pointer hover:underline font-medium">{book.author}</span>
                ) : (
                  <span className="text-slate-600">{book.author}</span>
                )}
              </p>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-blue-950">
              ₹{book.price}
              {book.listingType === "rent" && <span className="text-base font-normal text-slate-400 ml-2">/ semester</span>}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">About this copy</h2>
              <p className="text-slate-600 text-base leading-relaxed">{book.description}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              <StatCard icon="🔄" label="Times Rented"     value={book.rentedTillNow} />
              <StatCard icon="📖" label="Avg Reading Time" value={book.avgReadingTime} />
              <StatCard icon="📅" label="Avg Renting Time" value={book.avgRentingTime} />
            </div>

            {/* Seller */}
            <div className="bg-white border border-blue-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {book.seller.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-blue-950 text-base">{book.seller.name}</p>
                  <p className="text-sm text-slate-400">{book.seller.college}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <StarRating rating={book.seller.rating} />
                    <span className="text-sm text-slate-400">({book.seller.totalRatings})</span>
                  </div>
                </div>
              </div>
              <button className="text-base text-blue-600 hover:text-blue-800 font-medium transition-colors">
                View profile →
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={() => navigate("/buybook", { state: { book } })}
                className="w-full py-3.5 rounded-xl font-semibold text-base bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
                {book.listingType === "sell" ? "Buy Now" : "Rent Now"}
              </button>
              <button
                onClick={() => inCart ? removeFromCart(book.id) : addToCart(book)}
                className={`w-full py-3.5 rounded-xl font-semibold text-base border transition-all duration-200 ${
                  inCart ? "bg-blue-950 text-white border-blue-950" : "border-blue-200 text-blue-700 hover:bg-blue-50"
                }`}>
                {inCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => inWishlist ? removeFromWishlist(book.id) : addToWishlist(book)}
                  className={`py-3.5 rounded-xl font-semibold text-base border transition-all duration-200 ${
                    inWishlist ? "border-rose-400 text-rose-500 bg-rose-50" : "border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-400"
                  }`}>
                  {inWishlist ? "♥ Wishlisted" : "♡ Wishlist"}
                </button>
                <button className="py-3.5 rounded-xl font-semibold text-base border border-slate-200 text-slate-600
                  hover:border-blue-300 hover:text-blue-600 transition-all duration-200">
                  💬 Contact Seller
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Author Section ── */}
        {author && (
          <section className="bg-white border border-blue-100 rounded-2xl p-6 flex gap-5 items-start shadow-sm">
            <img src={author.img} alt={author.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-100 shadow-sm flex-shrink-0"
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=80&background=dbeafe&color=1d4ed8&bold=true`; }} />
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-1">About the Author</p>
              <h3 className="text-xl font-bold text-blue-950">{author.name}</h3>
              <p className="text-sm text-blue-400 mb-2">{author.genre}</p>
              <p className="text-slate-600 text-base leading-relaxed line-clamp-3">{author.about}</p>
              <button onClick={() => navigate(`/author/${author.id}`)}
                className="mt-3 text-base text-blue-600 hover:text-blue-800 font-medium transition-colors">
                View all books by {author.name} →
              </button>
            </div>
          </section>
        )}

        {/* ── Feedback ── */}
        <section>
          <h2 className="text-xl font-bold text-blue-950 mb-5">
            Reader Feedback
            <span className="ml-2 text-base font-normal text-slate-400">({book.feedback.length} reviews)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {book.feedback.map((fb) => (
              <div key={fb.id} className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-base">
                      {fb.user[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-blue-950 text-base">{fb.user}</p>
                      <p className="text-sm text-slate-400">{fb.college}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-300">{fb.date}</span>
                </div>
                <StarRating rating={fb.rating} size="sm" />
                <p className="text-slate-600 text-base leading-relaxed">"{fb.comment}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Related Books ── */}
        {book.relatedBooks?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-blue-950 mb-5">Related Books</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {book.relatedBooks.map((rb) => (
                <div key={rb.id} onClick={() => navigate(`/books/${rb.id}`)}
                  className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="h-40 overflow-hidden bg-blue-50">
                    <img src={rb.imageUrl} alt={rb.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = "https://placehold.co/160x160?text=Book"; }} />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-blue-950 text-base leading-snug line-clamp-2">{rb.title}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{rb.author}</p>
                    <p className="text-base font-bold text-blue-700 mt-1.5">₹{rb.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
