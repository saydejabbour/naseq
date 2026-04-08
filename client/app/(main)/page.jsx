import Image from "next/image";
import { Shirt, Sparkles, LayoutGrid, Users } from "lucide-react";
import Link from "next/link";
import { exploreData } from "@/services/explore";

export default function HomePage() {
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
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#7CB98B]/20 to-[#DDE8E1]/60 blur-xl" />
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
            <h2 className="font-playfair text-4xl font-bold text-[#1C2B22] leading-tight">
              Featured Outfits
            </h2>
            <Link
              href="/explore"
              className="hidden md:flex items-center gap-2 text-sm text-[#7CB98B] font-medium hover:gap-3 transition-all duration-200 group"
            >
              View all
              <span className="text-lg group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </Link>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-[#2F3E34]/20 to-transparent" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {exploreData.slice(0, 3).map((outfit, i) => (
            <div
              key={outfit.id}
              className="outfit-card group relative bg-white rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Index badge */}
              <div className="absolute top-4 left-4 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-[#2F3E34] shadow-sm">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Image */}
              <div className="relative w-full h-[360px] bg-[#F4F3EF] overflow-hidden">
                <Image
                  src={outfit.image}
                  alt={outfit.title}
                  fill
                  className="object-contain scale-[1.05] group-hover:scale-[1.12] transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
              </div>

              {/* Content */}
              <div className="px-5 pt-4 pb-6">
                <div className="flex gap-2 flex-wrap mb-3">
                  {outfit.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-[11px] font-medium bg-[#EEF5EF] text-[#3A7D52] px-3 py-1 rounded-full tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#1C2B22] leading-snug mb-1">
                  {outfit.title}
                </h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7CB98B]" />
                  <p className="text-sm text-[#7CB98B] font-medium">
                    {outfit.stylist}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#F0EDE8] flex items-center justify-between">
                  <span className="text-xs text-[#9BA89E] tracking-wide uppercase">
                    Styled Look
                  </span>
                  <button className="text-xs font-semibold text-[#2F3E34] flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200 group/btn">
                    Explore
                    <span className="w-5 h-5 rounded-full bg-[#2F3E34] text-white flex items-center justify-center text-[10px] group-hover/btn:bg-[#7CB98B] transition-colors duration-200">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="md:hidden text-center mt-10">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm text-[#7CB98B] font-medium"
          >
            View all outfits →
          </Link>
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