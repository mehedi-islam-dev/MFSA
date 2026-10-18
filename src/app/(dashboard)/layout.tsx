import Sidebar from "@/components/layout/Sidebar";
import GameTour from "@/components/tour/GameTour";
import { DataProvider } from "@/components/providers/DataProvider";
import PageTransition from "@/components/layout/PageTransition";
import MarineAgent from "@/components/ui/MarineAgent";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <div className="flex h-screen w-full overflow-hidden bg-mesh">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 relative">
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
        <GameTour />
        <MarineAgent />
      </div>
    </DataProvider>
  );
}
