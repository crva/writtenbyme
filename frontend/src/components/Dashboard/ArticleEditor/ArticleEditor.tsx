import UpgradeProDialog from "@/components/Account/UpgradeProDialog";
import AnalyticsDashboard from "@/components/Dashboard/AnalyticsDashboard/AnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArticle } from "@/stores/articleStore";
import { useUser } from "@/stores/userStore";
import type { Article } from "@/types/article";
import MDEditor from "@uiw/react-md-editor";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import "./ArticleEditor.css";

type Props = {
  article: Article;
  initialTab?: "editor" | "analytics";
};

export default function ArticleEditor({
  article,
  initialTab = "editor",
}: Props) {
  const { updateArticleContent, saveChanges, unsavedChanges } = useArticle();
  const user = useUser((state) => state.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

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

  const handleSave = useCallback(async () => {
    // Check if there are unsaved changes for this article
    if (!unsavedChanges[article.id]) {
      toast.error("No changes to save");
      return;
    }

    try {
      const result = await saveChanges(article.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Changes saved successfully");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save changes";
      toast.error(errorMessage);
    }
  }, [article.id, unsavedChanges, saveChanges]);

  // Used to handle save on CTRL+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSave]);

  return (
    <main className="h-screen w-screen p-2.5">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-col h-full w-full"
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
