import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/profile';
import { AppNavbar } from '@/components/app-navbar';
import { AppFooter } from '@/components/app-footer';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') {
    redirect('/protected/dashboard?error=forbidden');
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <AppNavbar showNavLinks isAdmin />
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 w-full">{children}</div>
        <AppFooter />
      </div>
    </main>
  );
}