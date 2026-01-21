import UpgradeProDialog from "@/components/Account/UpgradeProDialog";
import AnalyticsDashboard from "@/components/Dashboard/AnalyticsDashboard/AnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSaveArticle } from "@/hooks/useSaveArticle";
import { useArticle } from "@/stores/articleStore";
import { useUser } from "@/stores/userStore";
import type { Article } from "@/types/article";
import MDEditor from "@uiw/react-md-editor";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import "./ArticleEditor.css";

type Props = {
  article: Article;
  initialTab?: "editor" | "analytics";
};

export default function ArticleEditor({
  article,
  initialTab = "editor",
}: Props) {
  const { updateArticleContent } = useArticle();
  const user = useUser((state) => state.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  const { handleSave } = useSaveArticle({
    navigateToNewId: true,
    activeTab,
  });

  const handleContentChange = (content: string) => {
    updateArticleContent(article.id, content);
  };

  const handleTabChange = (tabValue: string) => {
    // If user is not paid and trying to access analytics, show upgrade dialog
    if (tabValue === "analytics" && !user?.isPaid) {
      setShowUpgradeDialog(true);
      return;
    }
    setActiveTab(tabValue as "editor" | "analytics");
    // Update URL query params
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tabValue);
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  const handleSaveClick = useCallback(async () => {
    await handleSave(article.id);
  }, [handleSave, article.id]);

  // Used to handle save on CTRL+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSaveClick]);

  return (
    <main className="h-screen w-screen p-2.5 flex flex-col">
      <div className="md:hidden mb-2 -m-2.5 p-2.5 border-b">
        <SidebarTrigger />
      </div>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-col flex-1 w-full"
      >
        <TabsList className="w-fit">
          <TabsTrigger value="editor" className="cursor-pointer">
            Editor
          </TabsTrigger>
          <TabsTrigger value="analytics" className="cursor-pointer">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="flex-1">
          <div className="article-editor dark flex h-full w-full gap-4">
            <MDEditor
              className="flex-1"
              value={article.content}
              onChange={(val) => handleContentChange(val || "")}
              visibleDragbar={false}
            />
          </div>
        </TabsContent>

        {user?.isPaid && (
          <TabsContent value="analytics" className="flex-1 overflow-auto">
            <div className="p-4">
              <AnalyticsDashboard
                articleId={article.id}
                title={article.title}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>

      <UpgradeProDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
      />
    </main>
  );
}
