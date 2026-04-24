import { ThemeSwitcher } from "@/components/theme-switcher";

export function AppFooter() {
  return (
    <footer className="app-footer w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>
        Powered by{" "}
        <a
          href="https://supabase.com/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
          style={{ color: "var(--app-footer-link)" }}
        >
          Supabase
        </a>
        {" "}and{" "}
        <a
          href="https://nextjs.org/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
          style={{ color: "var(--app-footer-link)" }}
        >
          Next.JS
        </a>
      </p>
      <ThemeSwitcher />
    </footer>
  );
}