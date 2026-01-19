import { Alert, AlertDescription } from "@/components/ui/alert";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useArticle } from "@/stores/articleStore";
import { useUser } from "@/stores/userStore";
import {
  AlertCircle,
  Check,
  Ellipsis,
  ExternalLink,
  Pen,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import ArticleRenameDialog from "./ArticleRenameDialog";

type Props = {
  articleId: string;
};

export default function ArticleSettings({ articleId }: Props) {
  const {
    removeArticle,
    saveChanges,
    discardChanges,
    unsavedChanges,
    articles,
  } = useArticle();
  const { user } = useUser();

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [saveError, setSaveError] = useState<string>("");

  const article = articles.find((a) => a.id === articleId);
  const hasUnsavedChanges = unsavedChanges[articleId] !== undefined;

  const handleSave = async () => {
    setSaveError("");
    const result = await saveChanges(articleId);
    if (result.error) {
      setSaveError(result.error);
    }
  };

  const handleDiscard = () => {
    discardChanges(articleId);
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    removeArticle(articleId);
    setDeleteConfirmOpen(false);
  };

  const handleView = () => {
    if (article) {
      window.open(`/${user?.username}/${article.slug}`, "_blank");
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="space-y-2">
      {saveError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <div className="p-1 rounded">
            <Ellipsis className="size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right">
          {hasUnsavedChanges && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    stopPropagation(e);
                    handleSave();
                  }}
                >
                  <Check className="size-4 text-green-500" />
                  Save changes
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>S</Kbd>
                  </KbdGroup>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    stopPropagation(e);
                    handleDiscard();
                  }}
                >
                  <X className="size-4 text-destructive" />
                  Discard changes
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}
          {article?.slug ? (
            <DropdownMenuItem
              onClick={(e) => {
                stopPropagation(e);
                handleView();
              }}
            >
              <ExternalLink className="size-4" />
              View
            </DropdownMenuItem>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative flex cursor-not-allowed select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm opacity-50">
                  <ExternalLink className="size-4" />
                  View
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                Save changes first to view the article
              </TooltipContent>
            </Tooltip>
          )}
          <DropdownMenuItem
            onClick={(e) => {
              stopPropagation(e);
              setRenameDialogOpen(true);
            }}
          >
            <Pen className="size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={(e) => {
              stopPropagation(e);
              handleDelete();
            }}
          >
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
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Article?"
        description={`Are you sure you want to delete "${article?.title}"? This action cannot be undone.`}
        confirmText="Delete Article"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
