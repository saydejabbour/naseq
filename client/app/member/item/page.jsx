"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AddItemPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    category_id: "",
    color: "",
    style: "",
    season: "",
    occasion: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!file) return setError("Upload image");

    const data = new FormData();
    data.append("image", file);
    data.append("user_id", user.user_id);

    try {
      const res = await fetch("http://localhost:5000/api/clothing/add", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      setSuccess(true);

      setTimeout(() => {
        router.push("/member/wardrobe");
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Add Item</h1>

      {error && <p>{error}</p>}
      {success && <p>Success</p>}

      <button onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
}