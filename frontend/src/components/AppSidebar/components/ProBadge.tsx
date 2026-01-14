import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export default function ProBadge() {
  return (
    <Badge className="ml-2 bg-primary text-xs/2">
      <Zap />
      <span>Pro</span>
    </Badge>
  );
}
