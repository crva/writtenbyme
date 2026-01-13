import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-12 md:py-16">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        ) : !currentArticle ? (
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
            {/* Username */}
            <div
              className="mb-8 cursor-pointer"
              onClick={() => navigate(`/${currentArticle.author}`)}
            >
              <h4 className="text-2xl md:text-2xl font-bold mb-4 text-center">
                <div className="flex justify-between items-baseline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <div>
                    <span>written by </span>
                    <span className="text-primary">{username}</span>
                  </div>
                  <span></span>
                </div>
              </h4>
              <Separator />
            </div>

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
