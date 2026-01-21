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
import { Spinner } from "@/components/ui/spinner";
import { useArticle } from "@/stores/articleStore";
import { AlertCircle } from "lucide-react";
import { useRef, useState } from "react";

interface NewArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (title: string) => Promise<void>;
}

export default function NewArticleDialog({
  open,
  onOpenChange,
  onConfirm,
}: NewArticleDialogProps) {
  const { articles } = useArticle();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = async () => {
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

    setIsLoading(true);
    try {
      await onConfirm(title.trim());
      setTitle("");
      setError("");
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create article"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
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
            disabled={isLoading}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!title.trim() || isLoading}>
              {isLoading && <Spinner className="mr-2" />}
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
