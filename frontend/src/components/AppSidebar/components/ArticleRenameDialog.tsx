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
import { useArticle } from "@/stores/articleStore";
import { useState } from "react";

type Props = {
  articleId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ArticleRenameDialog({
  articleId,
  open,
  onOpenChange,
}: Props) {
  const { articles, updateArticleTitle } = useArticle();
  const article = articles.find((a) => a.id === articleId);
  const [newTitle, setNewTitle] = useState(article?.title || "");

  const handleRename = () => {
    if (newTitle.trim()) {
      updateArticleTitle(articleId, newTitle);
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setNewTitle(article?.title || "");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Article</DialogTitle>
          <DialogDescription>
            Enter a new name for your article.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Article title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRename();
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRename}>Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
