import AppSidebar from "@/components/AppSidebar/AppSidebar";
import ArticleEditor from "@/components/Dashboard/ArticleEditor/ArticleEditor";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useArticle } from "@/stores/articleStore";

export default function Dashboard() {
  const { articles, selectedArticleId } = useArticle();

  const selectedArticle =
    selectedArticleId !== null
      ? articles.find((a) => a.id === selectedArticleId)
      : null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-screen w-screen p-2.5">
        {selectedArticle && <ArticleEditor article={selectedArticle} />}
      </main>
    </SidebarProvider>
  );
}
