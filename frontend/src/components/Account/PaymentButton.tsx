import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentButtonProps {
  isLoading?: boolean;
}

export default function PaymentButton({
  isLoading = false,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await apiPost<{ checkoutUrl: string }>(
        "/payments/create-checkout"
      );

      if (response.checkoutUrl) {
        // Redirect to Polar checkout
        window.location.href = response.checkoutUrl;
      }
    } catch {
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={loading || isLoading}
      className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground py-2 h-auto"
    >
      {loading || isLoading ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 size-4" />
      )}
      {loading || isLoading ? "Processing..." : "Upgrade to Pro - $7.99/month"}
    </Button>
  );
}
