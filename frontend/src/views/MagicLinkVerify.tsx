import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/stores/userStore";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function MagicLinkVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyMagicLink } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      return;
    }

    const verify = async () => {
      try {
        await verifyMagicLink(token);
        setVerified(true);
        setIsLoading(false);
        // Redirect to dashboard after verification succeeds
        navigate("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed");
        setIsLoading(false);
      }
    };

    verify();
  }, [token, verifyMagicLink, navigate]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Invalid Link</h1>
            <p className="text-muted-foreground mb-6">
              The magic link is missing or invalid. Please request a new one.
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard")} className="w-full">
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {isLoading && !verified && (
          <div className="flex flex-col items-center gap-4">
            <Spinner />
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">
                Verifying your link...
              </h1>
              <p className="text-muted-foreground">
                Please wait while we confirm your identity.
              </p>
            </div>
          </div>
        )}

        {verified && !error && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Success!</h1>
              <p className="text-muted-foreground">
                You're signed in. Redirecting to your dashboard...
              </p>
            </div>
          </div>
        )}

        {error && !verified && (
          <div className="flex flex-col items-center gap-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Sign In Failed</h1>
              <p className="text-muted-foreground mb-4">
                {error === "Magic link already used"
                  ? "This link has already been used. Please request a new one."
                  : error === "Magic link expired"
                  ? "This link has expired. Please request a new one."
                  : "There was an error verifying your link. Please try again."}
              </p>
            </div>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Back to Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
