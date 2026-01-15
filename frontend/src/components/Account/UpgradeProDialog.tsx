import PaymentButton from "@/components/Account/PaymentButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePaidUser } from "@/hooks/usePaidUser";
import { Check, Sparkles, X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UpgradeProDialog({ open, onOpenChange }: Props) {
  const isPaid = usePaidUser();

  // If user is already paid, don't show the dialog
  if (isPaid) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl!">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl">Upgrade to Pro</DialogTitle>
          <DialogDescription>
            Unlock up to 200 articles and advanced features to take your writing
            to the next level
          </DialogDescription>
        </DialogHeader>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Free Plan */}
          <div className="relative group p-6 rounded-xl border border-primary/20 bg-card/40 backdrop-blur hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              {/* Header */}
              <div className="space-y-1">
                <h3 className="text-2xl font-bold">Free</h3>
                <p className="text-sm text-muted-foreground">Current plan</p>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 pt-4 border-t border-primary/10">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-4 rounded-full bg-primary/20">
                    <Check className="size-2.5 text-primary" />
                  </div>
                  <span className="text-sm">1 Article</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-4 rounded-full bg-primary/20">
                    <Check className="size-2.5 text-primary" />
                  </div>
                  <span className="text-sm">Beautiful Reader Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-4 rounded-full bg-primary/20">
                    <Check className="size-2.5 text-primary" />
                  </div>
                  <span className="text-sm">Easy Sharing & Hosting</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <div className="flex items-center justify-center size-4 rounded-full bg-muted">
                    <X className="size-2.5 text-primary" />
                  </div>
                  <span className="text-sm">Statistics & Analytics</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <div className="flex items-center justify-center size-4 rounded-full bg-muted">
                    <X className="size-2.5 text-primary" />
                  </div>
                  <span className="text-sm">Advanced Features</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative group p-6 rounded-xl border-2 border-primary bg-linear-to-br from-primary/10 to-primary/5 backdrop-blur hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                <Sparkles className="size-3" />
                Recommended
              </span>
            </div>

            <div className="relative space-y-4 pt-2">
              {/* Header */}
              <div className="space-y-1">
                <h3 className="text-2xl font-bold">Pro</h3>
                <p className="text-sm text-muted-foreground">
                  For serious writers & creators
                </p>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$5.99</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cancel anytime, no questions asked
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2 pt-4 border-t border-primary/20">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-4 rounded-full bg-primary">
                    <Check className="size-2.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">
                    Up to 200 Articles
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-4 rounded-full bg-primary">
                    <Check className="size-2.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm">Beautiful Reader Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-4 rounded-full bg-primary">
                    <Check className="size-2.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm">Easy Sharing & Hosting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-4 rounded-full bg-primary">
                    <Check className="size-2.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">
                    Full Statistics & Analytics
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-4 rounded-full bg-primary">
                    <Check className="size-2.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm">Advanced Customization</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <PaymentButton />
      </DialogContent>
    </Dialog>
  );
}
