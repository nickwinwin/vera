'use client';

import { Loader2 } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import DashboardChat from '@/components/dashboard-chat';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'clinic')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-warm-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-brand-beige animate-spin mx-auto mb-4" />
          <p className="text-brand-muted text-sm">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-brand-warm-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
      <DashboardChat />
    </div>
  );
}
