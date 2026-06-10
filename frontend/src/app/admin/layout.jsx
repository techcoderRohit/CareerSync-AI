import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { SidebarProvider } from '@/context/SidebarContext';

export const metadata = {
  title: 'Admin Dashboard - CareerSync AI',
  description: 'Administrator control panel for CareerSync AI',
};

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden bg-slate-50 flex flex-col">
          <AdminTopBar />
          <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto w-full flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
