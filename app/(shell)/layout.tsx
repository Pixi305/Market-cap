import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { MobileTabBar } from "@/components/layout/MobileTabBar";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <main className="min-w-0 flex-1 p-6 pb-20 sm:pb-6">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  );
}
