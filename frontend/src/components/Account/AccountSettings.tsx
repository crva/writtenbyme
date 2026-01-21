import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { usePaidUser } from "@/hooks/usePaidUser";
import { useArticle } from "@/stores/articleStore";
import { useUser } from "@/stores/userStore";
import { CreditCard, LogOut, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Loader from "../Loader";

interface AccountSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AccountSettings({
  open,
  onOpenChange,
}: AccountSettingsProps) {
  const { user, updateUsername, deleteAccount, cancelSubscription } = useUser();
  const isPaid = usePaidUser();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cancelSubSuccess, setCancelSubSuccess] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [cancelSubConfirmOpen, setCancelSubConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelingSub, setIsCancelingSub] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [cancelSubError, setCancelSubError] = useState<string | null>(null);
  const resetStore = useArticle((state) => state.resetStore);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setError(null);
      setSuccess(false);
      setCancelSubSuccess(false);
    }
  }, [user, open]);

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    if (username === user?.username) {
      setError("New username must be different");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUsername(username);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update username",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount();
      onOpenChange(false);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete account",
      );
    } finally {
      resetStore();
      setIsDeleting(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelingSub(true);
    setCancelSubError(null);
    setCancelSubSuccess(false);
    try {
      await cancelSubscription();
      // Reset articles store to fetch fresh data
      resetStore();
      // Fetch fresh articles with new subscription status
      const { fetchArticles } = useArticle.getState();
      await fetchArticles();
      setCancelSubSuccess(true);
      setCancelSubConfirmOpen(false);
    } catch (err) {
      setCancelSubError(
        err instanceof Error ? err.message : "Failed to cancel subscription",
      );
    } finally {
      setIsCancelingSub(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Allow closing, but preserve error state when reopening
    onOpenChange(newOpen);
    // Only clear error if the user is closing AND there's an error
    // This lets them see the error before deciding to close
    if (!newOpen) {
      // Keep the error visible but allow close
      return;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Manage your account information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Username Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium block mb-2">Username</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(null);
                    setSuccess(false);
                  }}
                  placeholder="Enter new username"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleUpdateUsername}
                  disabled={isLoading}
                  className="min-w-24 sm:w-auto"
                >
                  {isLoading && <Loader />}
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && (
                <p className="text-sm text-green-600">
                  Username updated successfully!
                </p>
              )}
            </div>

            {/* Email Display */}
            <div className="space-y-2">
              <label className="text-sm font-medium block mb-2">Email</label>
              <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
                {user?.email}
              </div>
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            {/* Pro Subscription Section */}
            {isPaid && (
              <div className="bg-linear-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                    Pro Subscription Active
                  </h3>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
                  You have access to all premium features. Your subscription
                  renews automatically each month.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setCancelSubConfirmOpen(true)}
                  className="w-full gap-2 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50"
                  disabled={isCancelingSub}
                >
                  {isCancelingSub ? (
                    <Spinner className="mr-1" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  {isCancelingSub ? "Cancelling..." : "Cancel Subscription"}
                </Button>
                {cancelSubSuccess && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-3 font-medium">
                    ✓ Subscription cancelled successfully!
                  </p>
                )}
                {cancelSubError && (
                  <p className="text-sm text-destructive mt-3 font-medium">
                    ✗ {cancelSubError}
                  </p>
                )}
              </div>
            )}

            {/* Delete Account Section */}
            <div className="border-t pt-6">
              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-semibold text-destructive">
                  Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setDeleteConfirmOpen(true)}
                className="w-full gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Spinner className="mr-1" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </div>

            {/* Legal Links */}
            <div className="border-t pt-6 flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <Button variant="ghost" asChild className="text-xs sm:text-sm">
                <Link to="/privacy" target="_blank">
                  Privacy Policy
                </Link>
              </Button>
              <span className="text-muted-foreground">•</span>
              <Button variant="ghost" asChild className="text-xs sm:text-sm">
                <Link to="/terms" target="_blank">
                  Terms of Service
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={(newOpen) => {
          // Don't close if there's an error
          if (!newOpen && deleteError) {
            return;
          }
          setDeleteConfirmOpen(newOpen);
          if (!newOpen) {
            setDeleteError(null);
          }
        }}
        title="Delete Account?"
        description="This will permanently delete your account, all your articles, and all associated data. This action cannot be undone."
        confirmText="Delete Account"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteAccount}
        error={deleteError}
      />

      <ConfirmDialog
        open={cancelSubConfirmOpen}
        onOpenChange={(newOpen) => {
          // Don't close if there's an error
          if (!newOpen && cancelSubError) {
            return;
          }
          setCancelSubConfirmOpen(newOpen);
          if (!newOpen) {
            setCancelSubError(null);
          }
        }}
        title="Cancel Subscription?"
        description="If you cancel your subscription, all articles you wrote after your first one will be locked. Your first article will remain published and accessible. You can resubscribe anytime to unlock all your articles again."
        confirmText="Cancel Subscription"
        cancelText="Keep Subscription"
        isDestructive={true}
        isLoading={isCancelingSub}
        onConfirm={handleCancelSubscription}
        error={cancelSubError}
      />
    </>
  );
}
