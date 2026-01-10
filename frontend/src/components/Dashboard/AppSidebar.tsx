import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Article } from "@/types/article";
import { NewspaperIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router";

type Props = {
  articles: Article[];
};

export default function AppSidebar({ articles }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

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
                <span className="text-base font-semibold">writtenbyme</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Articles</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {articles.map((article) => (
                <SidebarMenuItem key={article.title}>
                  <SidebarMenuButton asChild>
                    <div
                      className={`cursor-pointer ${
                        Number(searchParams.get("article")) === article.id
                          ? "bg-primary"
                          : null
                      }`}
                      onClick={() =>
                        setSearchParams({ article: String(article.id) })
                      }
                    >
                      <NewspaperIcon />
                      <span>{article.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
