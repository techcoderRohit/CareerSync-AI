import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import { SidebarProvider } from '@/context/SidebarContext';

export const metadata = {
  title: 'Dashboard - CareerSync AI',
  description: 'User Dashboard for CareerSync AI',
};

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col">
          <TopBar />
          <div className="p-4 sm:p-8 md:p-10 relative z-10 max-w-7xl mx-auto w-full flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
