import MagicLinkDialog from "@/components/Account/MagicLinkDialog";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import ArticleEditor from "@/components/Dashboard/ArticleEditor/ArticleEditor";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useArticle } from "@/stores/articleStore";
import { useUser } from "@/stores/userStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";

export default function ArticleView() {
  const { articleId } = useParams<{ articleId: string }>();
  const [searchParams] = useSearchParams();
  const { articles, loading, setSelectedArticle, fetchArticles } = useArticle();
  const { isAuthenticated, checkAuth } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);

  const tab = searchParams.get("tab") || "editor";
  const article = articles.find((a) => a.id === articleId);

  // Check auth on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsInitialized(true);
    };
    initAuth();
  }, [checkAuth]);

  // Fetch articles when authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchArticles();
    }
  }, [isInitialized, isAuthenticated, fetchArticles]);

  // Set selected article when component mounts or articleId changes
  useEffect(() => {
    if (articleId && article) {
      setSelectedArticle(articleId);
    }
  }, [articleId, article, setSelectedArticle]);

  if (!isInitialized) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="h-screen w-screen p-2.5" />
      </SidebarProvider>
    );
  }

  if (!isAuthenticated) {
    return <MagicLinkDialog open={true} onOpenChange={() => {}} />;
  }

  if (!article) {
    if (loading) {
      return (
        <SidebarProvider>
          <AppSidebar />
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600 dark:text-slate-400" />
          </div>
        </SidebarProvider>
      );
    }
    return (
      <SidebarProvider>
        <AppSidebar />
        <div className="flex items-center justify-center flex-1">
          <p className="text-slate-600 dark:text-slate-400">
            Article not found
          </p>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <ArticleEditor
        article={article}
        initialTab={tab as "editor" | "analytics"}
      />
    </SidebarProvider>
  );
}
