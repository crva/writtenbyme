import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLayoutEffect, useRef, useState } from "react";

type Props = {
  title: string;
};

export default function ArticleTitle({ title }: Props) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    if (titleRef.current) {
      setIsOverflowing(
        titleRef.current.scrollWidth > titleRef.current.clientWidth
      );
    }
  }, [title]);

  if (isOverflowing) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span ref={titleRef} className="truncate">
              {title}
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">{title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <span ref={titleRef} className="truncate">
      {title}
    </span>
  );
}
