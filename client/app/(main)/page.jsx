"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/services/api";
import Image from "next/image";
import { Shirt, Sparkles, LayoutGrid, Users } from "lucide-react";
import Link from "next/link";


export default function HomePage() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const fetchOutfits = async () => {
      const res = await apiRequest("/outfits");
      if (res.success) {
        setOutfits(res.data);
      }
    };

    fetchOutfits();
  }, []);
  return (
    <>
      {/* 🔹 HERO SECTION */}
      <section className="max-w-7xl mx-auto px-10 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div>
          <h1 className="font-playfair text-5xl font-bold text-[#1C2B22] leading-tight">
            Plan Your Perfect <br /> Outfit Every Day
          </h1>
          <p className="mt-6 text-[#6B6666] text-lg leading-relaxed max-w-md">
            Organize your wardrobe, generate outfits with AI, and discover
            styles from top fashion experts.
          </p>
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link href="/signup">
              <button className="bg-[#2F3E34] text-white px-7 py-3.5 rounded-full font-medium hover:bg-[#7CB98B] transition-colors duration-300 shadow-md">
                Get Started
              </button>
            </Link>
            <Link href="/signup">
              <button className="border border-[#2F3E34]/30 text-[#2F3E34] px-7 py-3.5 rounded-full font-medium hover:border-[#7CB98B] hover:text-[#7CB98B] transition-colors duration-300">
                Apply as a Stylist
              </button>
            </Link>
          </div>
          <p className="mt-8 text-xs text-[#9BA89E]">
            Trusted by{" "}
            <span className="font-semibold text-[#2F3E34]">12,000+</span>{" "}
            fashion-forward users
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#9BA89E]/20 to-[#DDE8E1]/60 blur-xl" />
            <div className="relative bg-[#FEFAF1] p-4 rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.12)]">
              <Image
                src="/hero-new.png"
                alt="Outfit"
                width={500}
                height={250}
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 HOW IT WORKS */}
      <section className="py-20 bg-[#F7F9F7]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          
          <h2 className="font-playfair text-3xl font-bold text-[#1C2B22]">
            How It Works
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-10 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-6 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#7CB98B]/40 to-transparent" />

            {[
              {
                step: "01",
                title: "Add Your Clothes",
                desc: "Upload photos and categorize your wardrobe items with ease.",
              },
              {
                step: "02",
                title: "Generate Outfits",
                desc: "Let our smart engine build outfit combinations for you.",
              },
              {
                step: "03",
                title: "Get Inspired",
                desc: "Explore stylist templates and trending looks daily.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#2F3E34] text-white text-sm font-bold shadow-lg relative z-10">
                  {step}
                </div>
                <h3 className="mt-5 font-semibold text-[#1C2B22] text-base">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-[#9BA89E] leading-relaxed max-w-[200px]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 KEY FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          
          <h2 className="font-playfair text-3xl font-bold text-[#1C2B22]">
            Key Features
          </h2>

          <div className="mt-12 grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Shirt size={22} />,
                title: "Digital Wardrobe",
                desc: "Organize all your clothing in one place.",
              },
              {
                icon: <Sparkles size={22} />,
                title: "Outfit Generator",
                desc: "Auto-generate outfits based on your items.",
              },
              {
                icon: <LayoutGrid size={22} />,
                title: "Templates",
                desc: "Use stylist-curated templates for any occasion.",
              },
              {
                icon: <Users size={22} />,
                title: "Explore Stylists",
                desc: "Follow stylists and save their looks.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="feature-card group bg-[#FAFAF8] border border-[#EEEBE5] p-6 rounded-2xl hover:border-[#7CB98B]/40 text-left"
              >
                <div className="w-11 h-11 flex items-center justify-center bg-[#E8F5E9] rounded-xl text-[#7CB98B] group-hover:bg-[#7CB98B] group-hover:text-white transition-colors duration-300">
                  {icon}
                </div>
                <h3 className="mt-4 font-semibold text-[#1C2B22] text-sm">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-[#9BA89E] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 FEATURED OUTFITS */}
         <section className="py-24 px-6 bg-[#FAFAF8]">
  <div className="max-w-6xl mx-auto mb-14">
    <div className="flex items-end justify-between">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#7CB98B] mb-2">
          Curated Styles
        </p>
        <h2 className="font-playfair text-4xl font-bold text-[#1C2B22] leading-tight">
          Featured Outfits
        </h2>
      </div>
      <Link
        href="/explore"
        className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[#1C2B22] border border-[#D4E6D9] bg-white px-4 py-2 rounded-full hover:bg-[#EEF5EF] hover:border-[#7CB98B] transition-all duration-200"
      >
        View all <span className="text-[#7CB98B]">→</span>
      </Link>
    </div>
  </div>

  <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
    {outfits.slice(0, 3).map((outfit, i) => (
      <div
        key={outfit.id}
        className="group relative bg-white rounded-2xl overflow-hidden border border-[#E8F0EA] hover:border-[#B6D9C0] hover:shadow-[0_8px_32px_rgba(28,43,34,0.08)] transition-all duration-300"
      >
        {/* Image Block */}
       <div className="relative w-full h-[480px] bg-[#fdfcfa] overflow-hidden">
  <img
    src={`${process.env.NEXT_PUBLIC_API_URL}${outfit.image_url}`}
    alt={outfit.title}
    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
  />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Index badge */}
          <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[11px] font-bold text-[#2F3E34] shadow-sm">
            {String(i + 1).padStart(2, "0")}
          </div>

          {/* Tags float on image bottom */}
          <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
            {[outfit.style, outfit.season].map((tag, index) => (
              <span
                key={index}
                className="text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-[#2F6B40] px-3 py-1 rounded-full tracking-wide shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card Body */}
        <div className="px-5 pt-4 pb-5">
          <h3 className="font-playfair text-[1.2rem] font-bold text-[#1C2B22] leading-snug mb-1">
            {outfit.title}
          </h3>

          <p className="text-[13px] text-[#7CB98B] font-medium">
            {outfit.stylist}
          </p>

          {/* Divider */}
          <div className="my-4 border-t border-[#EEF0EC]" />

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#A8B8AB] tracking-wide uppercase">
              Styled Look
            </span>

            <Link
              href={`/explore/${outfit.id}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2F6B40] bg-[#EEF5EF] hover:bg-[#DFF0E4] px-4 py-1.5 rounded-full transition-colors duration-200"
            >
              Explore <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* 🔹 CTA SECTION */}
      <section className="py-20 px-6 flex justify-center">
        <div className="relative bg-[#2F3E34] p-12 rounded-3xl text-center max-w-3xl w-full overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#7CB98B]/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#7CB98B]/10 blur-2xl pointer-events-none" />

          
          <h2 className="font-playfair text-3xl font-bold text-white leading-snug">
            Ready to Style Smarter?
          </h2>
          <p className="mt-4 text-[#A8BDB0] text-base">
            Join thousands of fashion-forward users on Naseq.
          </p>
          <Link href="/signup">
            <button className="mt-8 bg-[#7CB98B] text-white px-8 py-3.5 rounded-full font-medium hover:bg-white hover:text-[#2F3E34] transition-colors duration-300 shadow-lg">
              Create Your Account
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}