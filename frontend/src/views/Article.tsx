import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useArticle } from "@/stores/articleStore";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
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

  useEffect(() => {
    if (!username || !articleSlug) return;
    fetchArticleBySlug(username, articleSlug);
  }, [username, articleSlug, fetchArticleBySlug]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 md:py-16">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Spinner />
          </div>
        ) : !currentArticle ? (
          <div className="flex flex-col items-center justify-center h-screen">
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
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              className="mb-8 -ml-2"
              onClick={() => navigate(`/${currentArticle.author}`)}
            >
              <ArrowLeft className="h-4 w-4" />
              <p>{currentArticle.author}</p>
            </Button>

            {/* Author and Title */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {currentArticle.title}
              </h1>
              <span className="text-sm text-muted">
                Last update:{" "}
                {new Date(currentArticle.updatedAt).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </span>
            </div>

            {/* Markdown Content */}
            <article className="react-markdown" data-color-mode="dark">
              <MDEditor.Markdown
                source={currentArticle.content}
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                }}
              />
            </article>
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
