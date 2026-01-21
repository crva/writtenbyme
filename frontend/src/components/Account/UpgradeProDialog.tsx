import PaymentButton from "@/components/Account/PaymentButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/useMobile";
import { usePaidUser } from "@/hooks/usePaidUser";
import { Check, Sparkles, X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UpgradeProDialog({ open, onOpenChange }: Props) {
  const isPaid = usePaidUser();
  const isMobile = useIsMobile();

  // If user is already paid, don't show the dialog
  if (isPaid) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        fullscreenMobile={true}
        className={isMobile ? "" : "w-[80vw]! max-w[80vh]! flex flex-col"}
      >
        <DialogHeader className="mb-4 flex-shrink-0">
          <DialogTitle className="text-2xl md:text-3xl">
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            Unlock up to 200 articles and advanced features to take your writing
            to the next level
          </DialogDescription>
        </DialogHeader>

        {/* Pricing Cards - Scrollable on mobile, fixed on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 overflow-y-auto flex-1 md:overflow-y-visible">
          {/* Free Plan */}
          <div className="relative group p-4 md:p-8 rounded-xl border border-primary/20 bg-card/40 backdrop-blur hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold">Free</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Current plan
                </p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold">$0</span>
                  <span className="text-muted-foreground text-sm md:text-base">
                    /month
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-6 border-t border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-5 rounded-full bg-primary/20 flex-shrink-0">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm md:text-base">1 Article</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-5 rounded-full bg-primary/20 flex-shrink-0">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm md:text-base">
                    Beautiful Reader Experience
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-5 rounded-full bg-primary/20 flex-shrink-0">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm md:text-base">
                    Easy Sharing & Hosting
                  </span>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <div className="flex items-center justify-center size-5 rounded-full bg-muted flex-shrink-0">
                    <X className="size-3 text-primary" />
                  </div>
                  <span className="text-sm md:text-base">
                    Statistics & Analytics
                  </span>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <div className="flex items-center justify-center size-5 rounded-full bg-muted flex-shrink-0">
                    <X className="size-3 text-primary" />
                  </div>
                  <span className="text-sm md:text-base">
                    Advanced Features
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative group p-4 md:p-8 rounded-xl border-2 border-primary bg-linear-to-br from-primary/10 to-primary/5 backdrop-blur hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
            {/* Essential Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                <Sparkles className="size-4" />
                Essential
              </span>
            </div>

            <div className="relative space-y-6 pt-4">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold">Pro</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  For serious writers & creators
                </p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold">$5.99</span>
                  <span className="text-muted-foreground text-sm md:text-base">
                    /month
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Cancel anytime, no questions asked
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-6 border-t border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-5 rounded-full bg-primary flex-shrink-0">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm md:text-base font-medium">
                    Up to 200 Articles
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-5 rounded-full bg-primary flex-shrink-0">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm md:text-base">
                    Beautiful Reader Experience
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-5 rounded-full bg-primary flex-shrink-0">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm md:text-base">
                    Easy Sharing & Hosting
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-5 rounded-full bg-primary flex-shrink-0">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm md:text-base font-medium">
                    Full Statistics & Analytics
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-5 rounded-full bg-primary flex-shrink-0">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm md:text-base">
                    Advanced Customization
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button - Sticky bottom */}
        <div className="flex-shrink-0 border-t pt-4 md:pt-6">
          <PaymentButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
