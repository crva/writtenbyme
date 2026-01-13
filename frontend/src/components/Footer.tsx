import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="py-4">
        <div className="flex justify-center items-center">
          <Button variant="ghost" className="text-lg font-semibold" asChild>
            <Link to="/">
              <span className="text-base font-semibold">writtenbyme</span>
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
