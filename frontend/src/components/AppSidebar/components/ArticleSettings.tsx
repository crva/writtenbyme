import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Ellipsis, Pen, Trash2, X } from "lucide-react";

type Props = {
  isSelected: boolean;
};

export default function ArticleSettings({ isSelected }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button className="p-1 hover:bg-sidebar-accent rounded">
          <Ellipsis className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right">
        {isSelected && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Check className="size-4 text-green-500" />
                Save changes
              </DropdownMenuItem>
              <DropdownMenuItem>
                <X className="size-4 text-destructive" />
                Discard changes
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem>
          <Pen className="size-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">
          <Trash2 className="size-4 text-destructive" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
