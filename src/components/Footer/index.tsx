import React from "react";
import Link from "next/link";
import Newsletter from "../Common/Newsletter";

const Footer = () => {
  return (
    <footer className="font-sans mt-auto">
      <Newsletter />
      <div className="bg-[#418729] text-white">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Logo and Contact Info */}
          <div className="flex flex-col">
            <div className="mb-6 bg-white inline-block max-w-max">
              <img 
                src="/images/logo/logo.png" 
                alt="MightyOlu Grocery" 
                className="w-auto h-28 object-contain"
              />
            </div>
            
            <ul className="flex flex-col gap-4 text-[15px] font-medium leading-relaxed">
              <li className="flex gap-3 items-start">
                <svg className="w-5 h-5 mt-1 flex-shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>10/11 Westside Plaza, Edinburgh. Scotland. EH14<br/>2SW.</span>
              </li>
              <li className="flex gap-3 items-center">
                <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>07867986338</span>
              </li>
              <li className="flex gap-3 items-center">
                <svg className="w-5 h-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>inquiry@mightyolu.com</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Important Link */}
          <div className="flex flex-col">
            <h3 className="text-[22px] font-bold mb-6 inline-block border-b-2 border-white pb-1 max-w-max">
              Important Link
            </h3>
            <ul className="flex flex-col gap-4 text-[15px] font-medium">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 3: Help Link */}
          <div className="flex flex-col">
            <h3 className="text-[22px] font-bold mb-6 inline-block border-b-2 border-white pb-1 max-w-max">
              Help Link
            </h3>
            <ul className="flex flex-col gap-4 text-[15px] font-medium">
              <li><Link href="/blogs" className="hover:underline">Our Blogs</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy And Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms And Conditions</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Follow Us */}
          <div className="flex flex-col">
            <h3 className="text-[22px] font-bold mb-6 inline-block border-b-2 border-white pb-1 max-w-max">
              Subscribe To Newsletter
            </h3>
            
            <form className="flex w-full mb-8 relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 text-gray-700 bg-white border border-white rounded-l outline-none focus:ring-2 focus:ring-[#58b038]"
                required
              />
              <button 
                type="submit" 
                className="px-5 py-3 bg-[#58b038] hover:bg-[#4a972f] transition-colors rounded-r flex items-center justify-center border border-[#58b038]"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </form>

            <h3 className="text-[17px] font-bold mb-4">
              Follow Us:
            </h3>
            <div className="flex gap-3">
              <a href="#" className="w-[34px] h-[34px] rounded-full bg-[#75a666] flex items-center justify-center hover:bg-white hover:text-[#418729] transition-colors text-white">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7v-3h3V9.5C10 6.74 11.64 5 14.08 5c1.2 0 2.46.21 2.46.21V8h-1.39c-1.36 0-1.79.84-1.79 1.71V12h3.1l-.5 3h-2.6v6.8C18.56 20.87 22 16.84 22 12z"/></svg>
              </a>
              <a href="#" className="w-[34px] h-[34px] rounded-full bg-[#75a666] flex items-center justify-center hover:bg-white hover:text-[#418729] transition-colors text-white">
                {/* TikTok icon */}
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.34 2.88 2.88 0 0 1 2.31-4.53 2.66 2.66 0 0 1 1.04.2v-3.24a5.83 5.83 0 0 0-1.04-.1 6.33 6.33 0 1 0 6.33 6.33V8.66a8.37 8.37 0 0 0 3.78 1.04z"/></svg>
              </a>
              <a href="#" className="w-[34px] h-[34px] rounded-full bg-[#75a666] flex items-center justify-center hover:bg-white hover:text-[#418729] transition-colors text-white">
                {/* WhatsApp icon */}
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 2.01a9.99 9.99 0 0 0-8.52 15.22L2 22l4.89-1.45a9.97 9.97 0 0 0 5.12 1.4h.01a10 10 0 0 0 10-10 10 10 0 0 0-10-10zm0 18.25a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.1.92.83-3.03-.2-.32A8.17 8.17 0 0 1 3.79 12a8.21 8.21 0 0 1 8.22-8.21A8.2 8.2 0 0 1 20.23 12a8.21 8.21 0 0 1-8.22 8.26zm4.51-6.17c-.25-.12-1.47-.73-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.98-.15.17-.3.19-.55.07a6.7 6.7 0 0 1-1.97-1.22 7.37 7.37 0 0 1-1.37-1.7c-.15-.26-.01-.4.11-.53.11-.11.25-.3.37-.45.12-.15.16-.25.24-.42.08-.17.04-.32-.02-.45-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.56-.42h-.47c-.2 0-.53.08-.8.37s-1.04 1.02-1.04 2.5 1.07 2.91 1.22 3.1 1.7 2.62 4.12 3.66c.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>
              </a>
              <a href="#" className="w-[34px] h-[34px] rounded-full bg-[#75a666] flex items-center justify-center hover:bg-white hover:text-[#418729] transition-colors text-white">
                {/* Instagram icon */}
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.64-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-4.27.2-6.78 2.71-6.98 6.98C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.27 2.71 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.27-.2 6.78-2.71 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.27-2.71-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.83A6.17 6.17 0 1 0 12 18.17a6.17 6.17 0 0 0 0-12.34zm0 10.16A3.99 3.99 0 1 1 12 8.01a3.99 3.99 0 0 1 0 7.98zm7.84-11.45a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Footer bottom */}
      <div className="bg-gradient-to-r from-[#70c74f] via-[#5db93b] to-[#408a28] py-5">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <p className="text-white text-[15px] font-medium">
            2026 &copy; MightyOlu Grocery. Crafted by <span className="text-[#db2777]">❤️</span> <span className="text-[#A21F24] font-bold">Dexnovate</span>
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
