import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AUTHORS, BOOKS } from "./HomePage";
import Footer from "./Footer";

export default function AuthorPage({ isLoggedIn, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const author = AUTHORS.find((a) => a.id === id);

  if (!author) {
    return (
      <div className="min-h-screen bg-blue-50 font-sans">
        <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
        <div className="max-w-4xl mx-auto px-6 pt-8">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <p className="text-center text-slate-400 mt-20 text-lg">Author not found.</p>
        </div>
      </div>
    );
  }

  // Books from BOOKS array that belong to this author
  const listedBooks = BOOKS.filter((b) => b.authorId === author.id);

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-6 pb-16">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-sm mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Author Hero */}
        <div className="bg-white border border-blue-100 rounded-2xl p-8 flex gap-8 items-start shadow-sm mb-10">
          <img src={author.img} alt={author.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md flex-shrink-0"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=128&background=dbeafe&color=1d4ed8&bold=true`;
            }} />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">{author.genre}</p>
            <h1 className="text-3xl font-bold text-blue-950 mb-3">{author.name}</h1>
            <p className="text-slate-600 text-base leading-relaxed">{author.about}</p>
          </div>
        </div>

        {/* Books listed on platform */}
        {listedBooks.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-blue-950 mb-5">
              Available on PowerXchange
              <span className="ml-2 text-sm font-normal text-slate-400">({listedBooks.length} listings)</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
              {listedBooks.map((book) => (
                <div key={book.id} onClick={() => navigate(`/books/${book.id}`)}
                  className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm
                    hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                  <div className="h-48 overflow-hidden bg-blue-50">
                    <img src={book.imageUrl} alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = "https://placehold.co/200x192?text=Book"; }} />
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-blue-950 text-sm leading-snug mb-1">{book.title}</p>
                    <p className="text-xs text-slate-400 mb-2">{book.genre}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-blue-700">₹{book.price}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        book.listingType === "sell" ? "bg-violet-100 text-violet-700" : "bg-teal-100 text-teal-700"
                      }`}>
                        {book.listingType === "sell" ? "For Sale" : "For Rent"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* All books by this author */}
        <h2 className="text-xl font-bold text-blue-950 mb-5">All Books by {author.name}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {author.books.map((book) => {
            const isListed = BOOKS.find((b) => b.id === book.id);
            return (
              <div key={book.id}
                onClick={() => isListed ? navigate(`/books/${book.id}`) : null}
                className={`bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${
                  isListed ? "cursor-pointer hover:shadow-md hover:-translate-y-1" : "opacity-75"
                }`}>
                <div className="h-36 overflow-hidden bg-blue-50">
                  <img src={book.img} alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://placehold.co/200x144?text=Book"; }} />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-blue-950 text-sm leading-snug mb-2">{book.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-700">₹{book.price}</span>
                    {isListed ? (
                      <span className="text-xs text-emerald-600 font-semibold">Available</span>
                    ) : (
                      <span className="text-xs text-slate-400">Not listed</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <Footer />
    </div>
  );
}
