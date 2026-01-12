import AccountLoginRegisterDialog from "@/components/Account/AccountLoginRegisterDialog";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import ArticleEditor from "@/components/Dashboard/ArticleEditor/ArticleEditor";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useArticle } from "@/stores/articleStore";
import { useUser } from "@/stores/userStore";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { articles, selectedArticleId, fetchArticles } = useArticle();
  const { checkAuth, isAuthenticated } = useUser();
  const [accountLoginRegisterDialogOpen, setAccountLoginRegisterDialogOpen] =
    useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsInitialized(true);
    };
    initAuth();
  }, [checkAuth]);

  // Fetch articles when user becomes authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchArticles();
    }
  }, [isInitialized, isAuthenticated, fetchArticles]);

  // Auto-open login dialog if user is not authenticated (after initial check)
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      setAccountLoginRegisterDialogOpen(true);
    }
  }, [isInitialized, isAuthenticated]);

  const selectedArticle =
    selectedArticleId !== null
      ? articles.find((a) => a.id === selectedArticleId)
      : null;

  return (
    <SidebarProvider>
      <AccountLoginRegisterDialog
        open={accountLoginRegisterDialogOpen}
        onOpenChange={setAccountLoginRegisterDialogOpen}
      />
      <AppSidebar />
      <main className="h-screen w-screen p-2.5">
        {selectedArticle && <ArticleEditor article={selectedArticle} />}
      </main>
    </SidebarProvider>
  );
}
