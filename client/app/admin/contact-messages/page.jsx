"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  CheckCircle,
  Inbox,
  ExternalLink,
  Send,
  X,
  Search,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

const API = "http://localhost:5000/api/contact/messages";

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  const { showToast } = useToast();

const [filter, setFilter] = useState("all");
const [search, setSearch] = useState("");

  const fetchMessages = async () => {
    const res = await fetch(API);
    const data = await res.json();

    if (data.success) {
      setMessages(data.data || []);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`${API}/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchMessages();
  };

  const openReplyBox = (msg) => {
    setReplyingTo(msg);
    setReplyMessage(`Hello ${msg.name},\n\n`);
  };

  const sendReply = async () => {
    if (!replyingTo || !replyMessage.trim()) return;

    setSending(true);

    try {
      const res = await fetch(`${API}/${replyingTo.message_id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: replyingTo.email,
          name: replyingTo.name,
          replyMessage,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Failed to send reply", "error");
        return;
      }

      showToast("Reply sent successfully", "success");
      setReplyingTo(null);
      setReplyMessage("");
      fetchMessages();
    } catch (err) {
      console.error(err);
      showToast("Failed to send reply", "error");
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter((msg) => {
  const status = msg.status || "new";

  const matchesStatus = filter === "all" || status === filter;

  const searchText = search.toLowerCase();

  const matchesSearch =
    msg.name?.toLowerCase().includes(searchText) ||
    msg.email?.toLowerCase().includes(searchText) ||
    msg.message?.toLowerCase().includes(searchText);

  return matchesStatus && matchesSearch;
});

  return (
    <div className="min-h-screen bg-[#FDF8F3] px-8 py-8">
      <div className="mb-8">
        <h1 className="text-[42px] font-bold text-[#2F3E34]">
          Contact Messages
        </h1>
        <p className="text-[#9B948B] text-lg">
          View and reply to messages sent from the contact page.
        </p>
      </div>

      <div className="bg-white border border-[#E8DED2] rounded-3xl p-4 mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
  <div className="relative w-full lg:max-w-md">
    <Search
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B948B]"
    />
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search by name, email, or message..."
      className="w-full rounded-2xl border border-[#E8DED2] bg-[#FDF8F3] py-3 pl-11 pr-4 text-sm outline-none text-[#2F3E34]"
    />
  </div>

  <div className="flex flex-wrap gap-2">
    {["all", "new", "replied", "resolved"].map((item) => (
      <button
        key={item}
        onClick={() => setFilter(item)}
        className={`px-4 py-2 rounded-2xl text-sm font-semibold capitalize transition ${
          filter === item
            ? "bg-[#7CB98B] text-white"
            : "bg-[#FDF8F3] text-[#2F3E34] border border-[#E8DED2]"
        }`}
      >
        {item}
      </button>
    ))}
  </div>
</div>

      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8DED2] p-10 text-center">
          <Inbox className="mx-auto text-[#7CB98B] mb-3" size={34} />
          <p className="text-[#9B948B]">No contact messages yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredMessages.map((msg) => (
            <div
              key={msg.message_id}
              className="bg-white rounded-3xl border border-[#E8DED2] shadow-sm p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2F3E34]">
                    {msg.name}
                  </h2>
                  <p className="text-sm text-[#9B948B]">{msg.email}</p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${
                    msg.status === "new"
                      ? "bg-[#FFF1E3] text-[#F5A962]"
                      : msg.status === "replied"
                      ? "bg-[#EAF6EE] text-[#7CB98B]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {msg.status || "new"}
                </span>
              </div>

              <p className="text-[#2F3E34] leading-relaxed bg-[#FDF8F3] border border-[#E8DED2] rounded-2xl p-4 mb-5">
                {msg.message}
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openReplyBox(msg)}
                  className="flex items-center gap-2 rounded-2xl bg-[#7CB98B] text-white px-4 py-2 text-sm font-semibold hover:opacity-90"
                >
                  <Mail size={16} />
                  Reply by Email
                </button>

                <button
                  onClick={() => updateStatus(msg.message_id, "replied")}
                  className="flex items-center gap-2 rounded-2xl bg-[#FFF1E3] text-[#F5A962] px-4 py-2 text-sm font-semibold"
                >
                  <ExternalLink size={16} />
                  Mark Replied
                </button>

                <button
                  onClick={() => updateStatus(msg.message_id, "resolved")}
                  className="flex items-center gap-2 rounded-2xl bg-gray-100 text-gray-600 px-4 py-2 text-sm font-semibold"
                >
                  <CheckCircle size={16} />
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {replyingTo && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl border border-[#E8DED2] shadow-xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#2F3E34]">
                  Reply to {replyingTo.name}
                </h2>
                <p className="text-sm text-[#9B948B]">{replyingTo.email}</p>
              </div>

              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={22} />
              </button>
            </div>

            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={7}
              className="w-full rounded-2xl border border-[#E8DED2] bg-[#FDF8F3] p-4 outline-none text-[#2F3E34]"
              placeholder="Write your reply..."
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setReplyingTo(null)}
                className="rounded-2xl bg-gray-100 text-gray-600 px-5 py-2 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={sendReply}
                disabled={sending}
                className="flex items-center gap-2 rounded-2xl bg-[#7CB98B] text-white px-5 py-2 font-semibold disabled:opacity-60"
              >
                <Send size={16} />
                {sending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}