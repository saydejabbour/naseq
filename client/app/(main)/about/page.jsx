"use client";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#FDF8F3] min-h-screen">

      <div className="max-w-4xl mx-auto px-6 py-20">

        {/* TITLE */}
        <h1 className="text-3xl font-playfair text-[#1C2B22] mb-10">
          About Naseq
        </h1>

        {/* MISSION */}
        <div className="mb-10">
          <h2 className="text-lg text-[#7CB98B] font-semibold mb-3">
            Our Mission
          </h2>
          <p className="text-[#6B6666] text-sm leading-relaxed">
            Naseq empowers individuals to express their style effortlessly.
            We believe everyone deserves a well-organized wardrobe and the
            confidence that comes with knowing what to wear.
          </p>
        </div>

        {/* VISION */}
        <div className="mb-10">
          <h2 className="text-lg text-[#7CB98B] font-semibold mb-3">
            Our Vision
          </h2>
          <p className="text-[#6B6666] text-sm leading-relaxed">
            To become the leading platform for smart outfit planning,
            connecting fashion lovers with professional stylists and AI-powered
            tools that make styling accessible to everyone.
          </p>
        </div>

        {/* WHY */}
        <div>
          <h2 className="text-lg text-[#7CB98B] font-semibold mb-3">
            Why Naseq?
          </h2>

          <ul className="text-[#6B6666] text-sm space-y-2 list-disc pl-5">
            <li>Digital wardrobe management made simple</li>
            <li>AI-powered outfit generation</li>
            <li>Expert stylist templates and inspiration</li>
            <li>Community-driven fashion discovery</li>
          </ul>
        </div>

      </div>

    </div>
  );
}