"use client";
import React from "react";
import "./css/euclid-circular-a-font.css";
import "./css/style.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Error from "@/components/Error";
import { ReduxProvider } from "@/redux/provider";
import { ChatbotProvider } from "./context/ChatbotContext";
import { ModalProvider } from "./context/QuickViewModalContext";
import { CartModalProvider } from "./context/CartSidebarModalContext";
import { PreviewSliderProvider } from "./context/PreviewSliderContext";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="font-euclid-circular-a font-normal text-base text-dark-3 relative z-1">
        <ReduxProvider>
          <ChatbotProvider>
            <CartModalProvider>
              <ModalProvider>
                <PreviewSliderProvider>
                  <Header />
                  <main>
                    <Error />
                  </main>
                  <Footer />
                </PreviewSliderProvider>
              </ModalProvider>
            </CartModalProvider>
          </ChatbotProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
