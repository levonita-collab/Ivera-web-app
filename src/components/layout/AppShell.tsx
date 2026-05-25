import Header from "./Header";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pb-20 max-w-2xl mx-auto w-full">{children}</main>
      <BottomNav />
    </div>
  );
}
