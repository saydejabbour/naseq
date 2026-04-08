import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F9F0F0] text-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Naseq Logo"
                width={50}
                height={50}
              />
              <span className="text-xl font-semibold text-[#F5A962]">
                Naseq
              </span>
            </div>

            <p className="text-sm text-gray-600">
              Smart Outfit Planning & Styling Platform
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#F5A962]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F5A962]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold mb-3">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore" className="hover:text-[#F5A962]">
                  Browse Outfits
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#F5A962]">
                  Join Naseq
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-3">Social</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#F5A962]">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F5A962]">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-10 pt-6 text-center text-sm text-gray-500">
          © 2026 Naseq. All rights reserved.
        </div>
      </div>
    </footer>
  );
}