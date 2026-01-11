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
                  className={`flex justify-between items-center cursor-pointer ${
                    selectedArticleId === article.id ? "bg-primary" : null
                  }`}
                  onClick={() => handleArticleSelect(article.id)}
                >
                  <div className="flex justify-center items-center gap-2">
                    <Newspaper className="size-4" />
                    <span>{article.title}</span>
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
