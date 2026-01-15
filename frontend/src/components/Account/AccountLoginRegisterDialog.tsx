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
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/stores/userStore";
import { AlertCircle, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Mode = "magic-link" | "email-password" | "register";
type FieldErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

// Validation Schemas
const magicLinkSchema = z.object({
  email: z.email("Invalid email address"),
});

const emailPasswordSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function AccountLoginRegisterDialog({
  open,
  onOpenChange,
}: Props) {
  const {
    register: userRegister,
    login: userLogin,
    sendMagicLink,
    isLoading,
    error: storeError,
    clearError,
  } = useUser();
  const [mode, setMode] = useState<Mode>("magic-link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Use store error directly instead of syncing to local state
  const generalError = storeError || "";

  const validateForm = (): boolean => {
    setErrors({});

    try {
      if (mode === "magic-link") {
        magicLinkSchema.parse({ email });
      } else if (mode === "email-password") {
        emailPasswordSchema.parse({ email, password });
      } else {
        registerSchema.parse({ username, email, password, confirmPassword });
      }
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
      if (mode === "magic-link") {
        await sendMagicLink(email);
        setMagicLinkSent(true);
      } else if (mode === "email-password") {
        await userLogin({ email, password });
        onOpenChange(false);
      } else {
        await userRegister({ username, email, password });
        onOpenChange(false);
      }
    } catch {
      // Error is already set in the store
    }
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setErrors({});
    setMagicLinkSent(false);
    clearError();
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    handleReset();
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
          <DialogTitle>
            {mode === "magic-link"
              ? "Sign In with Magic Link"
              : mode === "email-password"
              ? "Sign In with Email & Password"
              : "Create Account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "magic-link"
              ? "We'll send you a secure link to sign in"
              : mode === "email-password"
              ? "Enter your credentials to sign in"
              : "Create a new account with email and password"}
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
        {magicLinkSent && mode === "magic-link" && (
          <Alert className="bg-green-50 border-green-200">
            <Mail className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Check your email for a sign-in link. It will expire in 15 minutes.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          {/* Username field - only for register */}
          {mode === "register" && (
            <div className="space-y-1">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) {
                    setErrors({ ...errors, username: undefined });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSubmit();
                  }
                }}
                className={errors.username ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username}</p>
              )}
            </div>
          )}

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
                if (e.key === "Enter" && !isLoading) {
                  handleSubmit();
                }
              }}
              className={errors.email ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password field - only for email-password and register */}
          {(mode === "email-password" || mode === "register") && (
            <div className="space-y-1">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSubmit();
                  }
                }}
                className={errors.password ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>
          )}

          {/* Confirm Password field - only for register */}
          {mode === "register" && (
            <div className="space-y-1">
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: undefined });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSubmit();
                  }
                }}
                className={errors.confirmPassword ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          )}
        </div>

        <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "magic-link"
            ? "Send Magic Link"
            : mode === "email-password"
            ? "Sign In"
            : "Create Account"}
        </Button>

        {/* Account creation/login prompt - appears right after button */}
        {mode === "email-password" && (
          <div className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <button
              onClick={() => handleModeChange("register")}
              className="underline text-foreground hover:text-primary"
              disabled={isLoading}
            >
              Register
            </button>
          </div>
        )}

        {mode === "register" && (
          <div className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <button
              onClick={() => handleModeChange("email-password")}
              className="underline text-foreground hover:text-primary"
              disabled={isLoading}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Separator */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">
              Other options
            </span>
          </div>
        </div>

        {/* Alternative Authentication Methods */}
        {mode === "magic-link" && (
          <Button
            variant="outline"
            onClick={() => handleModeChange("email-password")}
            className="w-full"
            disabled={isLoading || magicLinkSent}
          >
            Use Email & Password
          </Button>
        )}

        {mode === "email-password" && (
          <Button
            variant="outline"
            onClick={() => handleModeChange("magic-link")}
            className="w-full"
            disabled={isLoading}
          >
            Use Magic Link
          </Button>
        )}

        {mode === "register" && (
          <Button
            variant="outline"
            onClick={() => handleModeChange("magic-link")}
            className="w-full"
            disabled={isLoading}
          >
            Use Magic Link
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
