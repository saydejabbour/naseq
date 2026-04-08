import Navbar from "@/components/Navbar";
import Footer from "../../components/Footer";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
});

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className={`pt-6 ${playfair.variable}`}>{children}</main>
      <Footer />
    </>
  );
}