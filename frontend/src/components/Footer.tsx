import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center gap-4 flex-wrap text-xs">
            <span className="text-muted-foreground">writtenbyme</span>
            <span className="text-muted-foreground">•</span>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/privacy">Privacy</Link>
            </Button>
            <span className="text-muted-foreground">•</span>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/terms">Terms</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
