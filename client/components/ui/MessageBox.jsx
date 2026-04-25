export default function MessageBox({ type = "success", text }) {
  if (!text) return null;

  const styles = {
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  return (
    <div
      className={`border px-4 py-3 rounded text-sm mt-4 ${styles[type]}`}
    >
      {text}
    </div>
  );
}