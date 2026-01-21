import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export default function ProBadge() {
  return (
    <Badge className="shrink-0 bg-primary text-xs/2">
      <Zap className="h-3 w-3" />
      <span>Pro</span>
    </Badge>
  );
}
