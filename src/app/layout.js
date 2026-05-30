import { Geist } from "next/font/google";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AppChrome from "../components/AppChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "OfCourt — Premium Badminton Rackets, Chosen by Players",
  description:
    "Shop pro-grade badminton rackets for power, speed, and control. Expert guidance, custom stringing, free shipping over $100, and secure checkout.",
  icons: {
    icon: "/ofcourt.svg",
    shortcut: "/ofcourt.svg",
    apple: "/ofcourt.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${fraunces.variable}`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <CartProvider>
            <AppChrome navbar={<Navbar />} footer={<Footer />}>
              {children}
            </AppChrome>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
