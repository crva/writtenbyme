import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Article } from "@/types/article";
import { Badge } from "lucide-react";
import { Link } from "react-router";
import SidebarArticles from "./components/SidebarArticles";
import SidebarUser from "./components/SidebarUser";

type Props = {
  articles: Article[];
  addArticle: () => void;
};

export default function AppSidebar({ articles, addArticle }: Props) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="#">
                <Badge />
                <span className="text-base font-semibold">writtenbyme</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarArticles articles={articles} addArticle={addArticle} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
