import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function TermsAndConditions({ isLoggedIn, onLogout, cart, wishlist }) {
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

        <h1 className="font-serif font-black text-4xl text-blue-950 mb-2">Terms & Conditions</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: January 2025</p>

        <div className="space-y-8 text-slate-700 text-base leading-relaxed">

          <section>
            <h2 className="font-bold text-blue-950 text-lg mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using PowerXchange, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform. These terms apply to all users including buyers, sellers, and visitors.</p>
          </section>

          <section>
            <h2 className="font-bold text-blue-950 text-lg mb-2">2. Eligibility</h2>
            <p>PowerXchange is intended for use by currently enrolled college students. By registering, you confirm that you are a student at a recognised educational institution. We reserve the right to verify eligibility and suspend accounts that do not meet this requirement.</p>
          </section>

          <section>
            <h2 className="font-bold text-blue-950 text-lg mb-2">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. All activity that occurs under your account is your responsibility. You must notify us immediately of any unauthorised use of your account.</p>
          </section>

          <section>
            <h2 className="font-bold text-blue-950 text-lg mb-2">4. Listings & Transactions</h2>
            <p>Sellers are responsible for the accuracy of their listings, including condition, price, and availability. PowerXchange acts as a marketplace and is not a party to any transaction between buyers and sellers. We do not guarantee the quality, safety, or legality of listed items.</p>
          </section>

          <section>
            <h2 className="font-bold text-blue-950 text-lg mb-2">5. Prohibited Conduct</h2>
            <p>Users may not post false, misleading, or fraudulent listings. Harassment, abuse, or threatening behaviour towards other users is strictly prohibited. Any attempt to manipulate the platform, bypass security measures, or misuse the reporting system will result in immediate account suspension.</p>
          </section>

          <section>
            <h2 className="font-bold text-blue-950 text-lg mb-2">6. Intellectual Property</h2>
            <p>All content, branding, and design elements on PowerXchange are the property of PowerXchange and its creators. Users may not reproduce, distribute, or create derivative works without explicit written permission.</p>
          </section>

          <section>
            <h2 className="font-bold text-blue-950 text-lg mb-2">7. Limitation of Liability</h2>
            <p>PowerXchange is not liable for any damages arising from the use or inability to use the platform, including disputes between buyers and sellers, loss of data, or unauthorised access to accounts. The platform is provided on an "as is" basis without warranties of any kind.</p>
          </section>

          <section>
            <h2 className="font-bold text-blue-950 text-lg mb-2">8. Changes to Terms</h2>
            <p>We reserve the right to update these Terms at any time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms. We will notify users of significant changes via email or in-app notification.</p>
          </section>

          <section>
            <h2 className="font-bold text-blue-950 text-lg mb-2">9. Contact</h2>
            <p>For questions about these Terms, please reach out to us at any of the following:</p>
            <ul className="mt-2 space-y-1">
              {["atmikanayak021206@gmail.com", "jatharva1701@gmail.com", "aakankshakpoojari265@gmail.com"].map(email => (
                <li key={email}><a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a></li>
              ))}
            </ul>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}