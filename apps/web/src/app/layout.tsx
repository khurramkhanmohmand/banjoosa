import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ToastProvider } from "@banjoosa/ui";
import { CatalogProvider } from "@/context/CatalogContext";
import { CartProvider } from "@/context/CartContext";
import { ItemModalProvider } from "@/context/ItemModalContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ItemDetailModal } from "@/components/ItemDetailModal";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: "Banjoosa — Shawarma, Burgers, Pizza & More",
  description: "Order shawarma, burgers, paratha rolls, pizza and loaded fries from Banjoosa — made to order, out the window hot.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Archivo:wght@400;600;800&family=Barlow+Condensed:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-ink bg-cream min-h-screen flex flex-col">
        <ToastProvider>
          <CatalogProvider>
            <CartProvider>
              <ItemModalProvider>
                <Header />
                {/* flex-1 pins the footer to the bottom of the viewport instead of it floating up under short pages */}
                <main className="flex-1 flex flex-col">
                  <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
                <CartDrawer />
                <ItemDetailModal />
              </ItemModalProvider>
            </CartProvider>
          </CatalogProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
