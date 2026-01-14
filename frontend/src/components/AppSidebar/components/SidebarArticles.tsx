import UpgradeProDialog from "@/components/Account/UpgradeProDialog";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePaidUser } from "@/hooks/usePaidUser";
import { useArticle } from "@/stores/articleStore";
import { Newspaper, PlusCircle } from "lucide-react";
import { useState } from "react";
import ArticleSettings from "./ArticleSettings";
import ArticleTitle from "./ArticleTitle";
import NewArticleDialog from "./NewArticleDialog";

export default function SidebarArticles() {
  const { articles, addArticle, selectedArticleId, setSelectedArticle } =
    useArticle();
  const isPaid = usePaidUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  const handleArticleSelect = (id: string) => {
    setSelectedArticle(id);
  };

  const handleNewArticleClick = () => {
    // If user is not paid and already has 1 article, show upgrade dialog
    if (!isPaid && articles.length >= 1) {
      setUpgradeDialogOpen(true);
      return;
    }
    setDialogOpen(true);
  };

  const handleNewArticle = (title: string) => {
    addArticle(title);
    setDialogOpen(false);
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
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="text-muted-foreground"
                onClick={() => handleNewArticleClick()}
              >
                <div className={`cursor-pointer`} onClick={() => {}}>
                  <PlusCircle />
                  <span>New article</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {articles.map((article) => (
              <SidebarMenuItem key={article.id}>
                <SidebarMenuButton
                  asChild
                  className={`${
                    selectedArticleId === article.id ? "hover:bg-primary" : null
                  }`}
                >
                  <div
                    className={`flex justify-between items-center cursor-pointer gap-2 ${
                      selectedArticleId === article.id ? "bg-primary" : null
                    }`}
                    onClick={() => handleArticleSelect(article.id)}
                  >
                    <div className="flex items-center gap-2 min-w-0 ">
                      <Newspaper className="size-4 shrink-0" />
                      <ArticleTitle title={article.title} />
                    </div>
                    <ArticleSettings articleId={article.id} />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
