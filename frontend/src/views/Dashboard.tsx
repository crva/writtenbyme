import AppSidebar from "@/components/Dashboard/AppSidebar";
import ArticleEditor from "@/components/Dashboard/ArticleEditor";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-screen w-screen p-4">
        <ArticleEditor />
      </main>
    </SidebarProvider>
  );
}
