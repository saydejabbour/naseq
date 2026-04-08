import Navbar from "@/components/Navbar";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-6">{children}</main>
    </>
  );
}