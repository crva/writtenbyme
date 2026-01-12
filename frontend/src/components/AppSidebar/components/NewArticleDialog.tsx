import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useArticle } from "@/stores/articleStore";
import { AlertCircle } from "lucide-react";
import { useRef, useState } from "react";

interface NewArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (title: string) => void;
}

export default function NewArticleDialog({
  open,
  onOpenChange,
  onConfirm,
}: NewArticleDialogProps) {
  const { articles } = useArticle();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = () => {
    setError("");
    if (!title.trim()) {
      return;
    }

    // Check if title already exists
    const titleExists = articles.some(
      (article) => article.title.toLowerCase() === title.trim().toLowerCase()
    );

    if (titleExists) {
      setError("An article with this title already exists");
      return;
    }

    onConfirm(title.trim());
    setTitle("");
    setError("");
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTitle("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Article</DialogTitle>
          <DialogDescription>
            Give your article a title to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Input
            ref={inputRef}
            placeholder="Article title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!title.trim()}>
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
