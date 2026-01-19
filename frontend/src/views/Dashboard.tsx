import MagicLinkDialog from "@/components/Account/MagicLinkDialog";
import AppSidebar from "@/components/AppSidebar/AppSidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useArticle } from "@/stores/articleStore";
import { useUser } from "@/stores/userStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function Dashboard() {
  const { fetchArticles } = useArticle();
  const { checkAuth, isAuthenticated, user } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchParams] = useSearchParams();
  const [paymentDialogDismissed, setPaymentDialogDismissed] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsInitialized(true);
    };
    initAuth();
  }, [checkAuth]);

  // Derive whether to show the dialog based on current conditions
  const paymentSuccess = searchParams.get("payment") === "success";
  const showPaymentProcessingDialog =
    paymentSuccess &&
    isInitialized &&
    isAuthenticated &&
    !user?.isPaid &&
    !paymentDialogDismissed;

  // Fetch articles when user becomes authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchArticles();
    }
  }, [isInitialized, isAuthenticated, fetchArticles]);

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <SidebarProvider>
      {!isAuthenticated && isInitialized && (
        <MagicLinkDialog open={true} onOpenChange={() => {}} />
      )}
      <Dialog
        open={showPaymentProcessingDialog}
        onOpenChange={(open) => {
          if (!open) {
            setPaymentDialogDismissed(true);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Processing</DialogTitle>
            <DialogDescription>
              Your payment is being processed. You'll be upgraded to Pro
              shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The upgrade may take a few minutes to process. Please refresh the
              page in a couple of minutes to see your Pro status update.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleRefreshPage} className="w-full">
                Refresh Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AppSidebar />
      {isInitialized && isAuthenticated && (
        <main className="h-screen w-screen p-2.5 flex items-center justify-center">
          <p className="text-slate-600 dark:text-slate-400">
            Select or create an article to get started
          </p>
        </main>
      )}
    </SidebarProvider>
  );
}
