"use client";

import { useState } from "react";
import { sendContactMessage } from "@/services/api";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    const res = await sendContactMessage(form);

    if (res?.success) {
      setResponseMsg("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } else {
      setResponseMsg(res?.message || "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center px-6 py-16">
      
      {/* 🔥 FIXED ALIGNMENT HERE */}
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center h-full">

         

          <h1 className="text-[2rem] leading-snug font-serif text-[#1E2D24] mb-4">
            Let's start a conversation
          </h1>

          <p className="text-[#6B6868] text-sm leading-relaxed mb-8 max-w-xs">
            Have a question or a project in mind? We're here for you. Drop us a
            message and we'll get back to you within 24 hours.
          </p>

          {/* INFO CARD */}
          <div className="bg-[#7CB98B] rounded-2xl p-5 flex flex-col gap-3">

            {/* EMAIL */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-4 h-4 stroke-[#307a43]" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Email</p>
                <p className="text-sm text-white">hello@yourcompany.com</p>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* PHONE */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-4 h-4 stroke-[#307a43]" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M3 5h2l3 7-2 2a16 16 0 006 6l2-2 7 3v2A2 2 0 0119 22 17 17 0 012 5a2 2 0 012-2z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Phone</p>
                <p className="text-sm text-white">+1 (555) 234-5678</p>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* RESPONSE TIME */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-4 h-4 stroke-[#307a43]" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Response time</p>
                <p className="text-sm text-white">Within 24 hours</p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-2xl border border-[#E5DEDE] p-8 md:p-10">
          <h2 className="text-xl font-serif text-[#1E2D24] mb-7">
            Send a message
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="block text-[11px] text-[#7A7676] mb-1.5">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#FAFAFA] border border-[#DDD7D7] rounded-lg text-sm focus:outline-none focus:border-[#7CB98B]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#7A7676] mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#FAFAFA] border border-[#DDD7D7] rounded-lg text-sm focus:outline-none focus:border-[#7CB98B]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#7A7676] mb-1.5">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#FAFAFA] border border-[#DDD7D7] rounded-lg text-sm focus:outline-none focus:border-[#7CB98B]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-[#7CB98B] text-white py-3 rounded-xl hover:bg-[#3e5245] transition"
            >
              {loading ? "Sending..." : "Send message"}
            </button>

          </form>

          {responseMsg && (
            <p className="mt-5 text-center text-sm text-[#2F6840]">
              {responseMsg}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}