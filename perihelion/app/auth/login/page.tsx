import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at 60% 0%, #0d1535 0%, #060912 70%)",
        fontFamily: "'EB Garamond', Georgia, serif",
        color: "#e8e4da",
      }}
    >
      {/* star-field decoration */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,.55) 0%, transparent 100%)," +
            "radial-gradient(1px 1px at 42% 65%, rgba(255,255,255,.4) 0%, transparent 100%)," +
            "radial-gradient(1.5px 1.5px at 75% 10%, rgba(255,255,255,.6) 0%, transparent 100%)," +
            "radial-gradient(1px 1px at 88% 45%, rgba(255,255,255,.35) 0%, transparent 100%)," +
            "radial-gradient(1px 1px at 30% 82%, rgba(255,255,255,.45) 0%, transparent 100%)," +
            "radial-gradient(1px 1px at 55% 38%, rgba(255,255,255,.3) 0%, transparent 100%)",
          zIndex: 0,
        }}
      />
      <div className="relative z-10 w-full max-w-sm px-5 py-10">
        <LoginForm />
      </div>
    </main>
  );
}