import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useArticle } from "@/stores/articleStore";
import { Newspaper, PlusCircle } from "lucide-react";
import ArticleSettings from "./ArticleSettings";
import ArticleTitle from "./ArticleTitle";

export default function SidebarArticles() {
  const { articles, addArticle, selectedArticleId, setSelectedArticle } =
    useArticle();

  const handleArticleSelect = (id: number) => {
    setSelectedArticle(id);
  };

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
            <SidebarMenuItem key={article.id}>
              <SidebarMenuButton asChild>
                <div
                  className={`flex justify-between items-center cursor-pointer gap-2 ${
                    selectedArticleId === article.id ? "bg-primary" : null
                  }`}
                  onClick={() => handleArticleSelect(article.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Newspaper className="size-4 shrink-0" />
                    <ArticleTitle title={article.title} />
                  </div>
                  <ArticleSettings articleId={article.id} />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
