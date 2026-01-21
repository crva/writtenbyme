import UpgradeProDialog from "@/components/Account/UpgradeProDialog";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaidUser } from "@/hooks/usePaidUser";
import { useArticle } from "@/stores/articleStore";
import { useUser } from "@/stores/userStore";
import { Lock, Newspaper, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import ArticleSettings from "./ArticleSettings";
import ArticleTitle from "./ArticleTitle";
import NewArticleDialog from "./NewArticleDialog";

export default function SidebarArticles() {
  const {
    articles,
    loading,
    addArticle,
    selectedArticleId,
    setSelectedArticle,
  } = useArticle();
  const { user } = useUser();
  const isPaid = usePaidUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  const handleArticleSelect = (id: string, status?: "published" | "locked") => {
    // If article is locked, show upgrade dialog instead
    if (status === "locked") {
      setUpgradeDialogOpen(true);
      return;
    }
    setSelectedArticle(id);
    const tab = searchParams.get("tab") || "editor";
    navigate(`/dashboard/articles/${id}?tab=${tab}`);
  };

  const handleNewArticleClick = () => {
    // If user is not paid and already has 1 article, show upgrade dialog
    if (!isPaid && articles.length >= 1) {
      setUpgradeDialogOpen(true);
      return;
    }
    setDialogOpen(true);
  };

  const handleNewArticle = async (title: string) => {
    const result = await addArticle(title);
    if (!result.error && result.id) {
      setDialogOpen(false);
      // Navigate to the new article
      const tab = searchParams.get("tab") || "editor";
      navigate(`/dashboard/articles/${result.id}?tab=${tab}`);
    }
  };

  return (
    <>
      <NewArticleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleNewArticle}
      />
      <UpgradeProDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
      />
      <SidebarGroup>
        <SidebarGroupLabel>Articles</SidebarGroupLabel>
        {user && (
          <SidebarGroupAction
            onClick={() => handleNewArticleClick()}
            title="New article"
          >
            <Plus className="size-4 text-muted-foreground cursor-pointer" />
          </SidebarGroupAction>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {loading && articles.length === 0 ? (
              <>
                {[1, 2, 3].map((i) => (
                  <SidebarMenuItem key={`skeleton-${i}`}>
                    <div className="space-y-2 w-full px-2 py-1.5">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </SidebarMenuItem>
                ))}
              </>
            ) : (
              articles.map((article) => (
                <SidebarMenuItem key={article.id}>
                  <SidebarMenuButton
                    asChild
                    className={`${
                      selectedArticleId === article.id
                        ? "hover:bg-primary"
                        : null
                    }`}
                  >
                    <div
                      className={`flex justify-between items-center cursor-pointer gap-2 ${
                        selectedArticleId === article.id ? "bg-primary" : null
                      }`}
                      onClick={() =>
                        handleArticleSelect(article.id, article.status)
                      }
                    >
                      <div className="flex items-center gap-2 min-w-0 ">
                        <Newspaper className="size-4 shrink-0" />
                        <ArticleTitle title={article.title} />
                        {article.status === "locked" && (
                          <Lock className="size-4 shrink-0 text-destructive" />
                        )}
                      </div>
                      <ArticleSettings articleId={article.id} />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
