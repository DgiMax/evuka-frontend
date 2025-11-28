import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "evuka",
  description: "A scalable e-learning platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers>
          <CartProvider>
            <WishlistProvider>
              {children}
              <Toaster 
                position="top-right"
                richColors 
                closeButton 
              />
            </WishlistProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
