"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import { ChatbotProvider } from "../context/ChatbotContext";
import { ChatBotButton, ChatBotPanel } from "@/components/ChatBot";


import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import GlobalKYCGuard from "@/components/Common/GlobalKYCGuard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();
  const isKYCSetupPage = pathname === "/b2b/kyc-setup";

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        {loading ? (
          <PreLoader />
        ) : (
          <> 
          <ReduxProvider>
            <ChatbotProvider>
              <GlobalKYCGuard />
              <CartModalProvider>
                <ModalProvider>
                  <PreviewSliderProvider>
                    {!isKYCSetupPage && <Header />}
                    {children}

                    {!isKYCSetupPage && <QuickViewModal />}
                    {!isKYCSetupPage && <CartSidebarModal />}
                    {!isKYCSetupPage && <PreviewSliderModal />}
                    {!isKYCSetupPage && <ChatBotButton />}
                    {!isKYCSetupPage && <ChatBotPanel />}
                  </PreviewSliderProvider>
                </ModalProvider>
              </CartModalProvider>
            </ChatbotProvider>
          </ReduxProvider>
          <ScrollToTop />
          {!isKYCSetupPage && <Footer />}
          </>
        )}
      </body>
    </html>
  );
}

