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
import { useArticle } from "@/stores/articleStore";
import { useUser } from "@/stores/userStore";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AccountSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AccountSettings({
  open,
  onOpenChange,
}: AccountSettingsProps) {
  const { user, updateUsername, deleteAccount } = useUser();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const resetStore = useArticle((state) => state.resetStore);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setError(null);
      setSuccess(false);
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
      // Give user feedback before closing
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update username"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
    } finally {
      resetStore();
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
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
              <div className="flex gap-2">
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
                  className="min-w-24"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
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
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Account?"
        description="This will permanently delete your account, all your articles, and all associated data. This action cannot be undone."
        confirmText="Delete Account"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}
