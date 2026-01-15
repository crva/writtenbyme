import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@/stores/userStore";
import { AlertCircle, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FieldErrors = {
  email?: string;
};

// Validation Schema
const magicLinkSchema = z.object({
  email: z.email("Invalid email address"),
});

export default function MagicLinkDialog({ open, onOpenChange }: Props) {
  const { sendMagicLink, isLoading, error: storeError, clearError } = useUser();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Use store error directly instead of syncing to local state
  const generalError = storeError || "";

  const validateForm = (): boolean => {
    setErrors({});

    try {
      magicLinkSchema.parse({ email });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FieldErrors = {};
        error.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          fieldErrors[path as keyof FieldErrors] = issue.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await sendMagicLink(email);
      setMagicLinkSent(true);
    } catch {
      // Error is already set in the store
    }
  };

  const handleReset = () => {
    setEmail("");
    setErrors({});
    setMagicLinkSent(false);
    clearError();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleReset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (newOpen === false) return; // Prevent outside click from closing
        handleOpenChange(newOpen);
      }}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader className="mb-2">
          <DialogTitle>Sign In with Magic Link</DialogTitle>
          <DialogDescription>
            We'll send you a secure link to sign in
          </DialogDescription>
        </DialogHeader>

        {/* General Error Alert */}
        {generalError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        )}

        {/* Magic Link Sent Message */}
        {magicLinkSent && (
          <Alert className="bg-green-50 border-green-200">
            <Mail className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Check your email for a sign-in link. It will expire in 15 minutes.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          {/* Email field */}
          <div className="space-y-1">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading && !magicLinkSent) {
                  handleSubmit();
                }
              }}
              className={errors.email ? "border-red-500" : ""}
              disabled={isLoading || magicLinkSent}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={isLoading || magicLinkSent}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Magic Link
        </Button>
      </DialogContent>
    </Dialog>
  );
}
