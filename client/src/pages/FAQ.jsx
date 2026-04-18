import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const faqs = [
  {
    q: "Who can use PowerXchange?",
    a: "PowerXchange is built for college students. Anyone with a valid student email or college affiliation can sign up and start buying or selling books on the platform."
  },
  {
    q: "How do I list a book for sale?",
    a: "Click \"Sell a Book\" from the navigation menu, fill in the book details including title, author, genre, condition, and price, upload a photo, and submit. Your listing will go live after admin approval."
  },
  {
    q: "How does the buying process work?",
    a: "Browse or search for a book, open its detail page, and click \"Buy Now\". You'll be prompted to send a message to the seller. Once both parties agree, the transaction is completed offline or as arranged."
  },
  {
    q: "What does book condition mean?",
    a: "We use four condition levels: Brand New (unused, no marks), Like New (minimal use, no damage), Good Condition (some wear but fully readable), and Old Copies (heavy use, may have highlights or worn pages)."
  },
  {
    q: "Is there a fee for listing or buying?",
    a: "No. PowerXchange is completely free for students. There are no listing fees, commissions, or hidden charges. The price you see is what you pay."
  },
  {
    q: "What is book exchange?",
    a: "If a seller sets the price to ₹0, it means they're open to exchanging the book rather than selling it. You can message them to propose an exchange with one of your own books."
  },
  {
    q: "How do I add a book to my wishlist?",
    a: "On any book's detail page, click the \"♡ Wishlist\" button. You can view and manage your wishlist from the navigation menu."
  },
  {
    q: "What happens after I send a buy request?",
    a: "The seller receives a notification about your interest. You can track the status of your request under Orders. The seller will accept or decline the request, after which you can arrange the handover."
  },
  {
    q: "Can I edit or remove my listing?",
    a: "Yes. Go to \"My Books\" from your profile to view all your active listings. From there you can mark a book as unavailable or manage your listings."
  },
  {
    q: "What if I have a problem with a transaction?",
    a: "You can use the Report button on any listing to flag it for admin review. For direct support, reach out to us via the Contact Us section in the footer."
  },
  {
    q: "Is my personal information shared with other users?",
    a: "Only the information needed to complete a transaction is shared — such as your name and college. We never share your email or phone number without your consent. See our Privacy Policy for full details."
  },
  {
    q: "How do I delete my account?",
    a: "To request account deletion, email us at atmikanayak021206@gmail.com, jatharva1701@gmail.com, or aakankshakpoojari265@gmail.com with the subject \"Account Deletion Request\". We'll process your request within 7 business days."
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl transition-all duration-200 ${open ? "border-blue-300 bg-white shadow-sm" : "border-blue-100 bg-white"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4">
        <span className="font-semibold text-blue-950 text-base">{q}</span>
        <span className={`text-blue-400 text-xl flex-shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-blue-50 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ({ isLoggedIn, onLogout, cart, wishlist }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} cart={cart} wishlist={wishlist} />

      <div className="max-w-3xl mx-auto px-6 py-12 pb-20">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 text-sm mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="font-serif font-black text-4xl text-blue-950 mb-2">Frequently Asked Questions</h1>
        <p className="text-slate-400 text-sm mb-10">Everything you need to know about PowerXchange.</p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        <div className="mt-12 bg-white border border-blue-100 rounded-2xl p-6 text-center">
          <p className="font-semibold text-blue-950 mb-1">Still have questions?</p>
          <p className="text-slate-500 text-sm mb-4">We're happy to help. Reach out to the team directly.</p>
          <div className="flex flex-col items-center gap-2">
            {["atmikanayak021206@gmail.com", "jatharva1701@gmail.com", "aakankshakpoojari265@gmail.com"].map(email => (
              <a key={email} href={`mailto:${email}`} className="text-blue-600 hover:underline text-sm">{email}</a>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}