import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useArticle } from "@/stores/articleStore";
import { Check, Ellipsis, Pen, Trash2, X } from "lucide-react";
import { useState } from "react";
import ArticleRenameDialog from "./ArticleRenameDialog";

type Props = {
  articleId: number;
};

export default function ArticleSettings({ articleId }: Props) {
  const {
    removeArticle,
    saveChanges,
    discardChanges,
    unsavedChanges,
    selectedArticleId,
  } = useArticle();

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  const hasUnsavedChanges = unsavedChanges[articleId] !== undefined;
  const isCurrentlySelected = selectedArticleId === articleId;

  const handleSave = () => {
    saveChanges(articleId);
  };

  const handleDiscard = () => {
    discardChanges(articleId);
  };

  const handleDelete = () => {
    removeArticle(articleId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button className="p-1 hover:bg-sidebar-accent rounded">
          <Ellipsis className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right">
        {isCurrentlySelected && hasUnsavedChanges && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleSave}>
                <Check className="size-4 text-green-500" />
                Save changes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDiscard}>
                <X className="size-4 text-destructive" />
                Discard changes
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
          <Pen className="size-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
          <Trash2 className="size-4 text-destructive" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <ArticleRenameDialog
        articleId={articleId}
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
      />
    </DropdownMenu>
  );
}
