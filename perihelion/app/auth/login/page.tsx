import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-sm px-5 py-10">
        <LoginForm />
      </div>
    </main>
  );
}