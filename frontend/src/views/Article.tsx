import { PageLayout } from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { useArticle } from "@/stores/articleStore";
import MDEditor from "@uiw/react-md-editor";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export default function Article() {
  const { username, articleSlug } = useParams<{
    username: string;
    articleSlug: string;
  }>();
  const navigate = useNavigate();
  const currentArticle = useArticle((state) => state.currentArticle);
  const loading = useArticle((state) => state.loading);
  const fetchArticleBySlug = useArticle((state) => state.fetchArticleBySlug);
  const clearCurrentArticle = useArticle((state) => state.clearCurrentArticle);

  useEffect(() => {
    if (!username || !articleSlug) return;
    clearCurrentArticle();
    fetchArticleBySlug(username, articleSlug);
  }, [username, articleSlug, fetchArticleBySlug, clearCurrentArticle]);

  return (
    <PageLayout
      loading={loading}
      username={username || ""}
      headerContent={
        <div className="flex justify-between items-baseline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <div>
            <span>written by </span>
            <span className="text-primary">{username}</span>
          </div>
          <span></span>
        </div>
      }
      onHeaderClick={() => navigate(`/${username}`)}
    >
      {!currentArticle ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Article not found
            </p>
            <Button asChild>
              <a href="/">Go back home</a>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Author and Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 wrap-break-word">
              {currentArticle.title}
            </h1>
            <span className="text-sm text-muted">
              Last update:{" "}
              {new Date(currentArticle.updatedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Markdown Content */}
          <article className="react-markdown">
            <div data-color-mode="dark">
              <MDEditor.Markdown
                source={currentArticle.content}
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                }}
              />
            </div>
          </article>
        </>
      )}
    </PageLayout>
  );
}
