"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { menuData } from "./menuData";
import Dropdown from "./Dropdown";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice, clearCart } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { 
  selectAuth, 
  selectIsAuthenticated, 
  selectUser, 
  selectCurrentView,
  selectHasB2BAccess,
  logout,
  switchView
} from "@/redux/features/auth-slice";
import Image from "next/image";
import { toast } from "react-toastify";
import logo from "../../../public/images/logo/logo.png";

const Header = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { openCartModal } = useCartModalContext();

  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const wishlist = useAppSelector((state) => state.wishlistReducer.items);

  // B2B Auth selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const currentView = useSelector(selectCurrentView);
  const hasB2BAccess = useSelector(selectHasB2BAccess);

  // Top Bar selector dropdown states
  const [currency, setCurrency] = useState("USD");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [lang, setLang] = useState({ code: "ENG", flag: "🇺🇸" });
  const [langOpen, setLangOpen] = useState(false);
  
  // User menu dropdown state
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currencyRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleOpenCartModal = () => {
    openCartModal();
  };
  
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setUserMenuOpen(false);
    toast.success("Logged out successfully");
  };
  
  const handleSwitchView = async () => {
    if (hasB2BAccess) {
      const targetView = currentView === 'personal' ? 'business' : 'personal';
      try {
        await dispatch(switchView()).unwrap();
        if (targetView === 'personal') {
          toast.success("Redirecting to Personal store...");
          window.location.href = process.env.NEXT_PUBLIC_LARAVEL_URL;
        } else {
          toast.success("Switched to Business view");
        }
      } catch (error) {
        toast.error("Failed to switch view");
      }
    }
  };

  const handleStickyMenu = () => {
    // Enable sticky header only after scrolling past the Top Bar
    if (window.scrollY >= 40) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setCurrencyOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const categoriesList = [
    "Desktop",
    "Laptop",
    "Monitor",
    "UPS",
    "Phone",
    "Watch",
    "Mouse",
    "Tablet"
  ];

  return (
    <header
      className={`fixed left-0 top-0 w-full z-9999 bg-white transition-shadow duration-300 ${
        stickyMenu ? "shadow-md" : "shadow-sm"
      }`}
    >
      {/* 1. TOP BAR */}
      <div
        className={`border-b border-gray-3 bg-gray-1 text-dark-3 text-[12px] py-2 transition-all duration-300 relative z-30 ${
          stickyMenu ? "h-0 py-0 opacity-0 overflow-hidden border-none" : "h-auto opacity-100"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex justify-center sm:justify-between items-center">
          <div className="hidden sm:block">
            <span className="font-semibold text-gray-500 tracking-wider uppercase">
              WELCOME TO  STORE MESSAGE OR REMOVE IT!
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end"> 
            {/* Quick Links */}
            <Link href="/contact" className="hover:text-blue transition-colors font-semibold">Contact Us</Link>
            
            {/* User Authentication Section */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 hover:text-blue transition-colors font-semibold"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{user.name}</span>
                  {hasB2BAccess && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue text-white text-[10px] rounded uppercase font-bold">
                      {currentView === 'business' ? 'B2B' : 'Retail'}
                    </span>
                  )}
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-56 bg-white border border-gray-3 shadow-lg rounded-md overflow-hidden z-999">
                    <div className="px-4 py-3 border-b border-gray-3 bg-gray-1">
                      <p className="text-sm font-semibold text-dark">{user.name}</p>
                      <p className="text-xs text-gray-5 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/my-account"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-gray-1 transition-colors"
                      >
                        My Account
                      </Link>
                      {hasB2BAccess && (
                        <>
                          {/* <Link
                            href="/b2b/business-profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm hover:bg-gray-1 transition-colors"
                          >
                            Business Profile
                          </Link> */}
                          <Link
                            href="/b2b/rfq/history"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm hover:bg-gray-1 transition-colors"
                          >
                            RFQ History
                          </Link>
                          <Link
                            href="/b2b/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm hover:bg-gray-1 transition-colors"
                          >
                            Order History
                          </Link>
                          <Link
                            href="/b2b/orders/drafts"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm hover:bg-gray-1 transition-colors"
                          >
                            Recurring Drafts
                          </Link>
                           
                        </>
                      )}
                      {user.kyc_id && user.kyc?.status !== 'approved' && (
                        <Link
                          href="/b2b/application-status"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-gray-1 transition-colors text-yellow-600 font-medium"
                        >
                          Application Status
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-gray-3">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-red/5 text-red transition-colors font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 hover:text-blue transition-colors font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <Link href="/signin">Sign In</Link>
                <span className="text-gray-4 font-normal">/</span>
                <Link href="/signup">Register</Link> 
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MIDDLE BAR */}
      <div className="border-b border-gray-2 py-3.5 bg-white relative z-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex justify-between items-center gap-5">
          {/* Logo & Main Nav container */}
          <div className="flex items-center gap-8">
            {/* Custom SVG Wolmart Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center hover:opacity-90 transition-opacity">
                <Image src={logo} alt="" width={50} height={50}/>
              </div>
            </Link>

            {/* Main Menu Navigation (Desktop) */}
            <nav className="hidden xl:block">
              <ul className="flex items-center gap-5.5">
                {menuData.map((menuItem, i) =>
                  menuItem.submenu ? (
                    <Dropdown
                      key={i}
                      menuItem={menuItem}
                      stickyMenu={stickyMenu}
                    />
                  ) : (
                    <li
                      key={i}
                      className="group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full"
                    >
                      <Link
                        href={menuItem.path || "/"}
                        className="hover:text-blue text-custom-sm font-bold text-dark flex py-3.5 transition-colors"
                      >
                        {menuItem.title}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="flex flex-col items-center hover:-translate-y-0.5 hover:text-blue transition-all duration-300 group"
            >
              <div className="relative">
                <svg className="w-6.5 h-6.5 text-dark group-hover:text-blue transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="flex items-center justify-center font-bold text-[10px] absolute -right-2 -top-1 bg-red text-white w-4.5 h-4.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  {wishlist?.length}
                </span>
              </div>
              <span className="text-[11px] text-dark group-hover:text-blue font-semibold mt-1 transition-colors">Wishlist</span>
            </Link>
 

            {/* Cart */}
            <button
              onClick={handleOpenCartModal}
              className="flex flex-col items-center hover:-translate-y-0.5 hover:text-blue transition-all duration-300 relative group"
            >
              <div className="relative">
                <svg className="w-6.5 h-6.5 text-dark group-hover:text-blue transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="flex items-center justify-center font-bold text-[10px] absolute -right-2 -top-1 bg-red text-white w-4.5 h-4.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  {product.length}
                </span>
              </div>
              <span className="text-[11px] text-dark group-hover:text-blue font-semibold mt-1 transition-colors">Cart</span>
            </button>

            {/* Hamburger Button (Mobile Drawer Toggle) */}
            <button
              id="Toggle"
              aria-label="Toggler"
              className="xl:hidden block text-dark hover:text-blue transition-colors ml-2"
              onClick={() => setNavigationOpen(!navigationOpen)}
            >
              <svg className="w-6.5 h-6.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR */}
      <div className="border-b border-gray-3 bg-white py-2 hidden lg:block relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex justify-between items-center gap-5">
          {/* Browse Categories & Search */}
          <div className="flex items-center flex-1 max-w-[850px]">
            {/* Browse Categories Menu */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button className="flex items-center justify-between gap-3 bg-white border border-gray-3 hover:bg-gray-1 hover:border-gray-4 text-dark font-bold text-custom-sm py-2.5 px-5 rounded-md min-w-[240px] transition-all duration-200">
                <span className="flex items-center gap-2.5">
                  <svg
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1H17M1 7H17M1 13H17"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Browse Categories
                </span>
                <svg
                  className={`w-3.5 h-3.5 fill-current transition-transform duration-200 ${
                    categoriesOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {categoriesOpen && (
                <div className="absolute left-0 top-full w-full bg-white border border-gray-3 border-t-0 shadow-lg rounded-b-md z-9999 py-1.5 transition-all">
                  {categoriesList.map((cat, idx) => (
                    <Link
                      key={idx}
                      href={`/product?category=${cat}`}
                      className="block px-5 py-2 text-custom-sm text-dark hover:bg-gray-1 hover:text-blue transition-colors font-medium border-l-[3px] border-transparent hover:border-blue"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Search Form with professional focus-within border */}
            <div className="flex-1 ml-6">
              <form
                action="/product"
                method="GET"
                className="flex items-center border border-gray-3 focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/15 rounded-md bg-white max-w-[550px] w-full transition-all h-[42px] overflow-hidden"
              >
                {/* Category Dropdown */}
                <div className="bg-gray-1 px-4 h-full border-r border-gray-3 flex-shrink-0 flex items-center relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent text-[13px] font-bold text-dark outline-none cursor-pointer pr-4.5 appearance-none focus:ring-0"
                  >
                    <option>All Categories</option>
                    {categoriesList.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 pointer-events-none text-dark flex items-center">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>

                {/* Input text box */}
                <input
                  type="text"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in..."
                  className="w-full px-4 text-custom-sm text-dark outline-none placeholder-gray-5 h-full bg-white"
                />

                {/* Search submit button */}
                <button
                  type="submit"
                  className="px-5 text-dark hover:text-blue transition-colors h-full flex items-center justify-center border-l border-gray-3 hover:bg-gray-1"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Right Links (Track Order, Daily Deals) with location pointer & tag icons */}
          <div className="flex items-center gap-6.5 text-custom-sm font-bold text-dark flex-shrink-0">
            <Link
              href="/my-account"
              className="flex items-center gap-2 hover:text-blue transition-colors group"
            >
              <svg className="w-5.5 h-5.5 text-dark group-hover:text-blue transition-colors" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Track Order</span>
            </Link>
            <Link
              href="/product"
              className="flex items-center gap-2 hover:text-blue transition-colors group"
            >
              <svg className="w-5.5 h-5.5 text-dark group-hover:text-blue transition-colors" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h.01M21 8l-9-9-9 9 9 9 9-9z" />
              </svg>
              <span>Daily Deals</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu Drawer */}
      {navigationOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-3 shadow-lg p-5 xl:hidden max-h-[70vh] overflow-y-auto">
          {/* Mobile Search */}
          <form action="/product" method="GET" className="flex items-center border border-gray-3 rounded overflow-hidden mb-4 bg-white">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              className="w-full px-4 py-2.5 text-custom-sm text-dark outline-none placeholder-gray-5"
            />
            <button type="submit" className="px-4 text-dark hover:text-blue transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Navigation Links */}
          <p className="text-2xs font-bold text-gray-5 uppercase tracking-wider mb-2.5">Navigation</p>
          <ul className="flex flex-col gap-4 pb-4 ">
            {menuData.map((menuItem, idx) => (
              <li key={idx} className="font-bold text-custom-sm text-dark">
                {menuItem.submenu ? (
                  <div>
                    <span className="block text-dark-3 text-xs mb-2 uppercase font-medium">{menuItem.title}</span>
                    <ul className="pl-4 flex flex-col gap-3">
                      {menuItem.submenu.map((sub, sIdx) => (
                        <li key={sIdx}>
                          <Link
                            href={sub.path}
                            onClick={() => setNavigationOpen(false)}
                            className="text-dark font-medium hover:text-blue transition-colors text-custom-sm"
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    href={menuItem.path || "/"}
                    onClick={() => setNavigationOpen(false)}
                    className="hover:text-blue transition-colors"
                  >
                    {menuItem.title}
                  </Link>
                )}
              </li>
            ))}
          </ul> 
        </div>
      )}
    </header>
  );
};

export default Header;
