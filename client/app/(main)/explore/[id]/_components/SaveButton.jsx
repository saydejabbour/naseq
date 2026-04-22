"use client";

export default function SaveButton({
  user,
  saved,
  saving,
  onSave,
  onSignup,
}) {
  // 🔒 NOT LOGGED IN
  if (!user) {
    return (
      <button
        onClick={onSignup}
       className="
  w-fit self-start
  flex items-center gap-2
  px-5 py-2
  bg-[#2d4a2d]
  text-white
  text-[12px]
  uppercase tracking-[0.08em]
  rounded
  shadow-[0_6px_20px_rgba(26,46,26,0.22)]
  transition-all duration-300
  hover:bg-[#1a2e1a]
  hover:-translate-y-[2px]
  hover:shadow-[0_12px_32px_rgba(26,46,26,0.35)]
"
      >
        <span>Sign up to Save This Look</span>

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  // ❤️ LOGGED IN
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className={`
        flex items-center gap-2
         px-6 py-2.5
        text-white
        text-[13px]
        uppercase tracking-[0.08em]
        rounded
        transition-all duration-300
        ${
          saved
            ? "bg-[#4a7c59] cursor-default shadow-[0_4px_14px_rgba(74,124,89,0.25)]"
            : "bg-[#2d4a2d] hover:bg-[#1a2e1a] hover:-translate-y-[2px] hover:shadow-[0_12px_32px_rgba(26,46,26,0.35)] shadow-[0_6px_20px_rgba(26,46,26,0.22)]"
        }
      `}
    >
      {/* TEXT STATES */}
      {saving ? (
        <span>Saving…</span>
      ) : saved ? (
        <>
          <span>Remove from Saved</span>

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </>
      ) : (
        <>
          <span>Save This Look</span>

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </>
      )}
    </button>
  );
}