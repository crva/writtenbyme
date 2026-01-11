import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Article } from "@/types/article";
import { Newspaper, PlusCircle } from "lucide-react";
import { useSearchParams } from "react-router";
import ArticleSettings from "./ArticleSettings";

type Props = {
  articles: Article[];
  addArticle: () => void;
};

export default function SidebarArticles({ articles, addArticle }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedArticle = searchParams.get("article")
    ? Number(searchParams.get("article"))
    : null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Articles</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-muted-foreground"
              onClick={addArticle}
            >
              <div className={`cursor-pointer`} onClick={() => {}}>
                <PlusCircle />
                <span>New article</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {articles.map((article) => (
            <SidebarMenuItem key={article.title}>
              <SidebarMenuButton asChild>
                <div
                  className={`flex justify-between items-center cursor-pointer ${
                    selectedArticle === article.id ? "bg-primary" : null
                  }`}
                  onClick={() =>
                    setSearchParams({ article: String(article.id) })
                  }
                >
                  <div className="flex justify-center items-center gap-2">
                    <Newspaper className="size-4" />
                    <span>{article.title}</span>
                  </div>
                  <ArticleSettings
                    isSelected={selectedArticle === article.id}
                  />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
