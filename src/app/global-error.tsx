"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafaf9",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ textAlign: "center", padding: "0 1.5rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#1c1917",
              margin: "0 0 0.5rem",
            }}
          >
            Something went wrong
          </h2>
          <p style={{ color: "#57534e", margin: "0 0 1.5rem" }}>
            Please refresh the page or try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "0.65rem 1.5rem",
              background: "#f97316",
              color: "#fff",
              border: 0,
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
