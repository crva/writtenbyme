import AppSidebar from "@/components/AppSidebar/AppSidebar";
import ArticleEditor from "@/components/Dashboard/ArticleEditor/ArticleEditor";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Article } from "@/types/article";
import { useState } from "react";
import { useSearchParams } from "react-router";

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 0,
      title: "Lorem Ipsum",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eleifend purus quis magna hendrerit porta ut sed felis. Sed consectetur vehicula urna, at ullamcorper nibh fermentum nec. Praesent congue tincidunt est, id volutpat nunc. Duis dolor arcu, volutpat eget euismod a, consectetur vitae orci. Aliquam a neque nibh. Aliquam sit amet suscipit ipsum. Fusce sit amet mi turpis. Suspendisse potenti.`,
    },
    {
      id: 1,
      title: "Lorem Ipsum 2",
      content: `bjr.`,
    },
  ]);

  const [searchParams] = useSearchParams();
  const selectedArticleId = Number(searchParams.get("article"));
  const selectedArticle = articles[selectedArticleId];

  const addArticle = () => {
    setArticles((prevArticles) => {
      return [
        ...prevArticles,
        {
          id: prevArticles[prevArticles.length - 1].id + 1,
          title: "New article",
          content: "",
        },
      ];
    });
  };

  const updateArticleContent = (val: string) => {
    setArticles((prevArticles) => {
      const updatedArticles = [...prevArticles];
      updatedArticles[selectedArticleId] = {
        ...updatedArticles[selectedArticleId],
        content: val,
      };
      return updatedArticles;
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar articles={articles} addArticle={addArticle} />
      <main className="h-screen w-screen p-2.5">
        {selectedArticle && (
          <ArticleEditor
            article={selectedArticle}
            onContentChange={updateArticleContent}
          />
        )}
      </main>
    </SidebarProvider>
  );
}
