import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useArticle } from "@/stores/articleStore";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

type Props = {
  articleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ArticleRenameDialog({
  articleId,
  open,
  onOpenChange,
}: Props) {
  const { articles, updateArticleTitle, saveChanges } = useArticle();
  const article = articles.find((a) => a.id === articleId);
  const [newTitle, setNewTitle] = useState(article?.title || "");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRename = async () => {
    setError("");
    if (!newTitle.trim()) {
      return;
    }

    // Check if new title already exists (and is not the same article)
    const titleExists = articles.some(
      (a) =>
        a.id !== articleId &&
        a.title.toLowerCase() === newTitle.trim().toLowerCase(),
    );

    if (titleExists) {
      setError("An article with this title already exists");
      return;
    }

    setIsLoading(true);
    try {
      updateArticleTitle(articleId, newTitle);
      const result = await saveChanges(articleId);
      if (result.error) {
        setError(result.error);
      } else {
        onOpenChange(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setNewTitle(article?.title || "");
      setError("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Rename Article</DialogTitle>
          <DialogDescription>
            Enter a new name for your article.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Input
            placeholder="Article title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRename();
              }
            }}
            autoFocus
            onFocus={(e) =>
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length,
              )
            }
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={isLoading}>
            {isLoading && <Spinner className="mr-2" />}
            {isLoading ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
