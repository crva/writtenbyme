import { useCallback } from "react";
import { useArticle } from "@/stores/articleStore";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

type SaveArticleOptions = {
  showSuccessToast?: boolean;
  onSuccess?: (result: {
    error?: string;
    success?: boolean;
    id?: string;
    slug?: string;
  }) => void;
  onError?: (error: string) => void;
  navigateToNewId?: boolean;
  activeTab?: string;
};

export const useSaveArticle = (options: SaveArticleOptions = {}) => {
  const {
    showSuccessToast = true,
    onSuccess,
    onError,
    navigateToNewId = false,
    activeTab,
  } = options;

  const { saveChanges, unsavedChanges } = useArticle();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSave = useCallback(
    async (articleId: string) => {
      // Check if there are unsaved changes for this article
      if (!unsavedChanges[articleId]) {
        toast.error("No changes to save");
        return;
      }

      try {
        const result = await saveChanges(articleId);
        if (result.error) {
          toast.error(result.error);
          onError?.(result.error);
          return;
        }

        if (showSuccessToast) {
          toast.success("Changes saved successfully");
        }

        // If a temporary article was saved, navigate to the new permanent ID
        if (navigateToNewId && result.id && result.id !== articleId) {
          const newParams = new URLSearchParams(searchParams);
          if (activeTab) newParams.set("tab", activeTab);
          navigate(`/dashboard/articles/${result.id}?${newParams.toString()}`, {
            replace: true,
          });
        }

        onSuccess?.(result);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save changes";
        toast.error(errorMessage);
        onError?.(errorMessage);
      }
    },
    [saveChanges, unsavedChanges, navigate, searchParams, activeTab, showSuccessToast, onSuccess, onError, navigateToNewId],
  );

  return { handleSave, unsavedChanges };
};
