import { Alert, AlertDescription } from "@/components/ui/alert";
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
    removeArticle(articleId);
  };

  const handleView = () => {
    if (article) {
      window.open(`/${user?.username}/${article.slug}`, "_blank");
    }
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
                <DropdownMenuItem onClick={handleSave}>
                  <Check className="size-4 text-green-500" />
                  Save changes
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>S</Kbd>
                  </KbdGroup>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDiscard}>
                  <X className="size-4 text-destructive" />
                  Discard changes
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}
          {article?.slug ? (
            <DropdownMenuItem onClick={handleView}>
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
    </div>
  );
}
