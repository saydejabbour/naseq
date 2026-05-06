"use client";

import { useEffect, useRef, useState } from "react";
import { apiRequest } from "@/services/api";
import Image from "next/image";
import {
  Shirt,
  Sparkles,
  LayoutGrid,
  Users,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const C = {
  ink: "#1A2820",
  forest: "#4F7F5E",
  sage: "#8FCB9B",
  leaf: "#6FAE7A",
  cream: "#FEFAF1",
  sand: "#F5EFE0",
  amber: "#F5A962",
  blush: "#F0DDD4",
  mist: "#E8F0EA",
  ghost: "#9BA89E",
};

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -64 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 64 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const Label = ({ children, accent = C.sage }) => (
  <motion.p
    variants={fadeUp}
    className="mb-3 text-[10px] font-bold tracking-[0.3em] uppercase"
    style={{ color: accent }}
  >
    {children}
  </motion.p>
);

const Blob = ({ className = "", animate, transition, style }) => (
  <motion.div
    animate={animate}
    transition={transition}
    style={style}
    className={`absolute rounded-full pointer-events-none blur-3xl ${className}`}
  />
);

function EditorialStrip() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 1.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "top" }}
        className="absolute top-0 right-12 w-[2px] h-full bg-gradient-to-b from-transparent via-[#7CB98B]/30 to-transparent"
      />

      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 1.5, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "bottom" }}
        className="absolute top-0 right-6 w-[1px] h-full bg-gradient-to-b from-transparent via-[#F5A962]/20 to-transparent"
      />
    </div>
  );
}

export default function HomePage() {
  const [outfits, setOutfits] = useState([]);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const fetchOutfits = async () => {
      const res = await apiRequest("/outfits");
      if (res.success) {
        setOutfits(res.data || []);
      }
    };

    fetchOutfits();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return "/hero-new.png";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) {
      return url;
    }
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${url}`;
  };

 const heroImages = [
  "/publichero-fashion-1.jpg",
  "/publichero-fashion-2.jpg",
  "/publichero-fashion-3.jpg",
  "/publichero-fashion-4.jpg",
];
  return (
    <div
      className="font-sans overflow-x-hidden"
      style={{ background: C.cream, color: C.ink }}
    >
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${C.cream} 0%, #EFF6F1 55%, #FAF4E8 100%)`,
        }}
      >
        <EditorialStrip />

        <Blob
          className="top-[-8%] left-[-6%] w-[40vw] h-[40vw] opacity-40"
          style={{
            background: `radial-gradient(circle, ${C.sage}33 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.12, 1], x: [0, 18, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <Blob
          className="bottom-[5%] right-[-4%] w-[34vw] h-[34vw] opacity-35"
          style={{
            background: `radial-gradient(circle, ${C.amber}2A 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.15, 1], y: [0, -24, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <Blob
          className="top-[40%] left-[35%] w-[22vw] h-[22vw] opacity-20"
          style={{
            background: `radial-gradient(circle, ${C.blush} 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroO }}
className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-[0.9fr_1.3fr] gap-16 items-center py-28"        >
          <motion.div variants={fadeLeft} initial="hidden" animate="visible">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full border text-[11px] font-semibold tracking-[0.22em] uppercase"
              style={{
                borderColor: `${C.sage}50`,
                color: C.sage,
                background: `${C.sage}0D`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: C.sage }}
              />
              Your Smart Styling Space
            </motion.div>

            <h1
              className="font-playfair text-[clamp(2.8rem,5.5vw,4.4rem)] font-bold leading-[1.08] tracking-tight"
              style={{ color: C.forest }}
            >
              Plan Your
              <br />
              <span className="relative inline-block">
                Perfect Outfit
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: 1,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    transformOrigin: "left",
                    background: `${C.sage}22`,
                  }}
                  className="absolute inset-x-0 bottom-1 h-3 -z-10 rounded-sm"
                />
              </span>{" "}
              Every Day
            </h1>

            <p
              className="mt-7 text-[1.05rem] leading-relaxed max-w-[420px]"
              style={{ color: C.ghost }}
            >
              Organize your wardrobe, generate outfits, and discover
styles from top fashion experts.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.75 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link href="/signup">
                <button
                  className="group relative overflow-hidden px-8 py-3.5 rounded-full font-semibold text-white text-sm shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${C.forest} 0%, ${C.leaf} 100%)`,
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ArrowUpRight size={15} />
                  </span>
                </button>
              </Link>

              <Link href="/signup">
                <button
                  className="px-8 py-3.5 rounded-full font-semibold text-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    borderColor: `${C.forest}28`,
                    color: C.forest,
                    background: "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  Apply as a Stylist
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-2.5">
                {["#7CB98B", "#F5A962", "#4A7C59", "#F0DDD4"].map(
                  (bg, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ background: bg }}
                    />
                  )
                )}
              </div>

              <p className="text-xs" style={{ color: C.ghost }}>
                Trusted by{" "}
                <span className="font-bold" style={{ color: C.forest }}>
                  12,000+
                </span>{" "}
                fashion-forward users
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            className="relative flex justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              className="absolute w-[540px] h-[540px] rounded-full border opacity-10"
              style={{ borderColor: C.sage }}
            />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[440px] h-[440px] rounded-full border border-dashed opacity-10"
              style={{ borderColor: C.amber }}
            />

            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div
                className="absolute -inset-6 rounded-[2.5rem] blur-2xl opacity-50"
                style={{
                  background: `radial-gradient(ellipse, ${C.sage}40 0%, ${C.amber}18 60%, transparent 100%)`,
                }}
              />

              <div
                className="relative rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(28,43,34,0.18)] border"
                style={{
                  background: "rgba(255,250,241,0.9)",
                  backdropFilter: "blur(20px)",
                  borderColor: "rgba(255,255,255,0.7)",
                }}
              >
    <div className="relative w-full md:w-[650px] h-[620px] mx-auto">
  {[
    {
      src: "/publichero-fashion-1.jpg",
      className: "top-0 left-[2%] w-[88%] h-[260px]",
      z: 1,
      rotate: -1,
    },
    {
      src: "/publichero-fashion-2.jpg",
      className: "top-[120px] right-[0%] w-[82%] h-[255px]",
      z: 2,
      rotate: 1,
    },
    {
      src: "/publichero-fashion-3.jpg",
      className: "top-[245px] left-[7%] w-[86%] h-[255px]",
      z: 3,
      rotate: -0.5,
    },
    {
      src: "/publichero-fashion-4.jpg",
      className: "top-[370px] right-[4%] w-[78%] h-[240px]",
      z: 4,
      rotate: 1.2,
    },
  ].map((img, i) => (
    <motion.div
      key={img.src}
      style={{
        zIndex: img.z,
        rotate: img.rotate,
      }}
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: i * 0.15,
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        zIndex: 30,
      }}
      className={`absolute overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_30px_80px_rgba(28,43,34,0.18)] ${img.className}`}
    >
      <Image
        src={img.src}
        alt={`Fashion inspiration ${i + 1}`}
        fill
        className="object-cover transition-transform duration-700 hover:scale-110"
      />
    </motion.div>
  ))}
</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.7 }}
                  className="absolute -bottom-5 -left-7 hidden md:flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl border"
                  style={{
                    background: "rgba(255,250,241,0.95)",
                    backdropFilter: "blur(16px)",
                    borderColor: C.mist,
                  }}
                >
              
                 
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.7 }}
                  className="absolute -top-4 -right-5 hidden md:flex items-center gap-2 rounded-xl px-4 py-2.5 shadow-xl border text-[11px] font-semibold"
                  style={{
                    background: C.forest,
                    color: "white",
                    borderColor: `${C.leaf}60`,
                  }}
                >
                 
                 
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: C.ghost }}
        >
          <span className="text-[10px] tracking-[0.2em] uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* EDITORIAL STRIP */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={stagger}
        className="relative py-16 overflow-hidden"
        style={{ background: C.forest }}
      >
        <div className="flex overflow-hidden whitespace-nowrap select-none">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 pr-12"
          >
            {Array(8)
              .fill([
                "Digital Wardrobe",
                "Outfit Generator",
                "Stylist Templates",
                "Fashion Forward",
                "Naseq",
              ])
              .flat()
              .map((t, i) => (
                <span
                  key={i}
                  className="text-[11px] tracking-[0.35em] uppercase font-semibold opacity-30"
                  style={{ color: "white" }}
                >
                  {t} <span className="opacity-40 mx-4">·</span>
                </span>
              ))}
          </motion.div>
        </div>

        <motion.div
          variants={stagger}
          className="mt-10 max-w-3xl mx-auto px-6 flex items-center justify-around"
        >
          {[
            { value: "12K+", label: "Users" },
            { value: "48K+", label: "Outfits" },
            { value: "820+", label: "Stylists" },
            { value: "4.9★", label: "Rating" },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="flex flex-col items-center"
            >
              <span className="font-playfair text-[2rem] font-bold text-white">
                {s.value}
              </span>
              <span
                className="text-[10px] tracking-[0.28em] uppercase mt-1"
                style={{ color: C.sage }}
              >
                {s.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* HOW IT WORKS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="relative py-28 overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${C.cream} 0%, #EDF5EF 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <Label>Simple Process</Label>

          <motion.h2
            variants={fadeUp}
            className="font-playfair text-[clamp(2rem,3.5vw,3rem)] font-bold"
            style={{ color: C.forest }}
          >
            How It Works
          </motion.h2>

          <motion.div
            variants={stagger}
            className="mt-16 grid md:grid-cols-3 gap-8 relative"
          >
            <div
              className="hidden md:block absolute top-9 left-[18%] right-[18%] h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${C.sage}40, transparent)`,
              }}
            />

            {[
              {
                step: "01",
                title: "Add Your Clothes",
                desc: "Upload photos and categorize your wardrobe items effortlessly.",
                icon: <Shirt size={18} />,
              },
              {
                step: "02",
                title: "Generate Outfits",
                desc: "Let our smart engine craft perfect outfit combinations for you.",
                icon: <Sparkles size={18} />,
              },
              {
                step: "03",
                title: "Get Inspired",
                desc: "Explore stylist templates and discover trending looks daily.",
                icon: <LayoutGrid size={18} />,
              },
            ].map(({ step, title, desc, icon }) => (
              <motion.div
                key={step}
                variants={fadeUp}
                whileHover={{
                  y: -10,
                  boxShadow: "0 28px 60px rgba(28,43,34,0.12)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="flex flex-col items-center rounded-3xl p-8 text-center border relative group"
                style={{
                  background: "rgba(255,250,241,0.8)",
                  backdropFilter: "blur(12px)",
                  borderColor: C.mist,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${C.forest}, ${C.leaf})`,
                  }}
                >
                  {icon}
                </div>

                <h3
                  className="font-semibold text-base mb-2"
                  style={{ color: C.forest }}
                >
                  {title}
                </h3>

                <p
                  className="text-sm leading-relaxed max-w-[200px]"
                  style={{ color: C.ghost }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* KEY FEATURES */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-28 bg-white"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <Label accent={C.amber}>Premium Tools</Label>
              <motion.h2
                variants={fadeUp}
                className="font-playfair text-[clamp(2rem,3.5vw,3rem)] font-bold"
                style={{ color: C.forest }}
              >
                Key Features
              </motion.h2>
            </div>

            <motion.p
              variants={fadeRight}
              className="text-sm max-w-xs leading-relaxed"
              style={{ color: C.ghost }}
            >
              Everything you need to manage, style, and elevate your personal
              wardrobe — all in one place.
            </motion.p>
          </div>

          <motion.div variants={stagger} className="grid md:grid-cols-4 gap-5">
            {[
              {
                icon: <Shirt size={20} />,
                title: "Digital Wardrobe",
                desc: "Organize all your clothing in one curated space.",
                accent: C.sage,
              },
              {
                icon: <Sparkles size={20} />,
                title: "Outfit Generator",
                desc: "Auto-generate looks based on your items and mood.",
                accent: C.amber,
              },
              {
                icon: <LayoutGrid size={20} />,
                title: "Templates",
                desc: "Use stylist-curated templates for any occasion.",
                accent: C.blush,
              },
              {
                icon: <Users size={20} />,
                title: "Explore Stylists",
                desc: "Follow fashion experts and save their editorial looks.",
                accent: C.sage,
              },
            ].map(({ icon, title, desc, accent }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -12, scale: 1.025 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="group relative rounded-2xl p-6 border overflow-hidden cursor-default"
                style={{ background: C.cream, borderColor: "#EDEAE4" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${accent}18`, color: accent }}
                >
                  {icon}
                </div>

                <h3
                  className="font-semibold text-sm mb-2"
                  style={{ color: C.forest }}
                >
                  {title}
                </h3>

                <p className="text-sm leading-relaxed" style={{ color: C.ghost }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* EDITORIAL INTERLUDE */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ background: C.sand }}
      >
        <Blob
          className="top-0 left-0 w-[50vw] h-[50vw] opacity-30"
          style={{
            background: `radial-gradient(circle, ${C.sage}22 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1fr_1.4fr] gap-16 items-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeLeft}
          >
            <p
              className="text-[10px] font-bold tracking-[0.3em] uppercase mb-5"
              style={{ color: C.amber }}
            >
              Editorial
            </p>

            <h2
              className="font-playfair text-[clamp(2.2rem,4vw,3.4rem)] font-bold leading-[1.1] mb-6"
              style={{ color: C.forest }}
            >
              Fashion
              <br />
              Meets
              <br />
              Intelligence
            </h2>

            <div
              className="w-10 h-0.5 mb-6"
              style={{ background: C.sage }}
            />

            <p
              className="text-base leading-relaxed max-w-sm"
              style={{ color: C.ghost }}
            >
              Naseq understands your lifestyle and your aesthetic — then
curates a wardrobe experience unlike any other.
            </p>

            <Link
              href="/explore"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: C.forest }}
            >
              Explore the platform <ArrowUpRight size={15} />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="relative flex gap-3 h-[340px] items-end"
          >
            {[
  {
    h: "82%",
    bg: "#99C8ED",
    delay: 0,
    img: "/model-blue.png",
  },
  {
    h: "100%",
    bg: "#908A60",
    delay: 0.1,
    img: "/model-green.png",
  },
  {
    h: "72%",
     bg: "#F3D3D2",
    delay: 0.2,
    img: "/model-pink.png",
  },
  {
    h: "92%",
    bg: "#5B6F4F",
    delay: 0.05,
    img: "/model-darkgreen.png",
  },
  {
    h: "62%",
    bg: "#DF7302", 
    delay: 0.15,
    img: "/model-orange.png",
  },
  {
    h: "78%",
     bg: "#BAA588",
    delay: 0.25,
    img: "/model-beige.png",
  },
  {
    h: "96%",
    bg: "#B999C2",
    delay: 0.08,
    img: "/model-lavender.png",
  },
].map((bar, i) => (
  <motion.div
    key={i}
    variants={{
      hidden: {
        scaleY: 0,
        opacity: 0,
      },
      visible: {
        scaleY: 1,
        opacity: 1,
        transition: {
          delay: bar.delay,
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    }}
    style={{
      height: bar.h,
      background: bar.bg,
      transformOrigin: "bottom",
      flex: 1,
    }}
    whileHover={{
      scaleY: 1.04,
      y: -6,
    }}
    transition={{
      type: "spring",
      stiffness: 260,
    }}
    className="relative rounded-[2rem] cursor-default overflow-visible flex items-end justify-center"
  >
    {/* MODEL */}
    <motion.img
      src={bar.img}
      alt="fashion model"
      className="absolute bottom-0 object-contain pointer-events-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)]"
      style={{
        height: "125%",
        width: "auto",
      }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4 + i,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.04,
      }}
    />
  </motion.div>
))}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="absolute -right-4 top-8 rounded-xl px-4 py-3 shadow-xl border text-xs font-semibold"
             
            >
             
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED OUTFITS */}
      <section className="py-28 overflow-hidden" style={{ background: C.cream }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="max-w-6xl mx-auto px-6"
        >
          <div className="flex items-end justify-between mb-16">
            <div>
              <Label>Curated Styles</Label>
              <motion.h2
                variants={fadeUp}
                className="font-playfair text-[clamp(2rem,3.5vw,3rem)] font-bold"
                style={{ color: C.forest }}
              >
                Featured Outfits
              </motion.h2>
            </div>

            <motion.div variants={fadeRight}>
              <Link
                href="/explore"
                className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  borderColor: `${C.sage}40`,
                  color: C.forest,
                  background: "white",
                }}
              >
                View all <ArrowUpRight size={14} style={{ color: C.sage }} />
              </Link>
            </motion.div>
          </div>

          <motion.div variants={stagger} className="grid md:grid-cols-3 gap-7">
            {outfits.slice(0, 3).map((outfit, i) => (
              <motion.div
                key={outfit.id || i}
                variants={scaleIn}
                whileHover={{ y: -14 }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
                className="group relative rounded-2xl overflow-hidden border shadow-sm hover:shadow-[0_30px_70px_rgba(28,43,34,0.14)] transition-shadow duration-500"
                style={{ background: "white", borderColor: "#EBE8E2" }}
              >
                <div className="relative w-full h-[460px] overflow-hidden bg-[#F7F4EE]">
                  <img
                    src={getImageUrl(outfit.image_url)}
                    alt={outfit.title || "Outfit"}
                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-transparent" />

                  <div
                    className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md"
                    style={{
                      background: "rgba(255,250,241,0.92)",
                      color: C.forest,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                    {[outfit.style, outfit.season].filter(Boolean).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-3 py-1 rounded-full tracking-wide"
                        style={{
                          background: "rgba(255,250,241,0.90)",
                          color: C.leaf,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-5 py-5">
                  <h3
                    className="font-playfair text-[1.1rem] font-bold mb-1"
                    style={{ color: C.forest }}
                  >
                    {outfit.title}
                  </h3>

                  <p
                    className="text-[13px] font-medium mb-4"
                    style={{ color: C.sage }}
                  >
                    {outfit.stylist}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wide"
                      style={{ color: "#C8CECA" }}
                    >
                      Styled Look
                    </span>

                    <Link
                      href={`/explore/${outfit.id}`}
                      className="inline-flex items-center gap-1.5 text-[12px] font-bold px-4 py-1.5 rounded-full transition-colors duration-200"
                      style={{ background: C.mist, color: C.leaf }}
                    >
                      Explore <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="py-20 px-6 flex justify-center bg-white"
      >
        <motion.div
          whileHover={{ scale: 1.012 }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          className="relative rounded-[2.5rem] p-14 text-center max-w-3xl w-full overflow-hidden"
          style={{
            background: `linear-gradient(140deg, ${C.forest} 0%, #1A2F20 50%, #162A1C 100%)`,
            boxShadow: "0 40px 100px rgba(28,43,34,0.22)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-12 -right-12 w-52 h-52 rounded-full blur-3xl pointer-events-none"
            style={{ background: `${C.sage}50` }}
          />

          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute -bottom-12 -left-12 w-52 h-52 rounded-full blur-3xl pointer-events-none"
            style={{ background: `${C.amber}40` }}
          />

          <div className="relative z-10">
            <motion.p
              variants={fadeUp}
              className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
              style={{ color: C.sage }}
            >
              Start Today
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="font-playfair text-[clamp(2rem,4vw,3rem)] font-bold text-white leading-tight"
            >
              Ready to Style Smarter?
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base max-w-sm mx-auto"
              style={{ color: "#A8BDB0" }}
            >
              Join thousands of fashion-forward users on Naseq and transform the
              way you dress.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Link href="/signup">
                <button
                  className="mt-9 group inline-flex items-center gap-2 px-9 py-4 rounded-full font-semibold text-sm shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: C.sage, color: "white" }}
                >
                  Create Your Account
                  <ArrowUpRight size={15} />
                </button>
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-[11px]"
              style={{ color: `${C.sage}80` }}
            >
              Free to start · No credit card required
            </motion.p>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}