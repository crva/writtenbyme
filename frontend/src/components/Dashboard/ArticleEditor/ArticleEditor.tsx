import { useArticle } from "@/stores/articleStore";
import type { Article } from "@/types/article";
import MDEditor from "@uiw/react-md-editor";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import "./ArticleEditor.css";

type Props = {
  article: Article;
};

export default function ArticleEditor({ article }: Props) {
  const { updateArticleContent, saveChanges, unsavedChanges } = useArticle();

  const handleContentChange = (content: string) => {
    updateArticleContent(article.id, content);
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
    <div className="article-editor dark flex h-full w-full gap-4">
      <MDEditor
        className="flex-1"
        value={article.content}
        onChange={(val) => handleContentChange(val || "")}
        visibleDragbar={false}
      />
    </div>
  );
}
