
"use client";

import { useRouter } from "next/navigation";

export default function StatsBackButton() {
  const router = useRouter();

  function handleBack() {
    const referrer = document.referrer;

    // Only go back automatically when the previous page
    // belongs to this same website.
    if (
      referrer &&
      new URL(referrer).origin === window.location.origin
    ) {
      router.back();
    } else {
      router.push("/stats");
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 16px",
        marginBottom: 20,
        border: "1px solid #334155",
        borderRadius: 9,
        background: "#172338",
        color: "#f8fafc",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      <span aria-hidden="true">←</span>
      Back
    </button>
  );
}
