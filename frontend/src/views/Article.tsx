import { Button } from "@/components/ui/button";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

export default function Article() {
  const { username, articleSlug } = useParams<{
    username: string;
    articleSlug: string;
  }>();
  const [article, setArticle] = useState<{
    title: string;
    content: string;
    author: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!username || !articleSlug) return;

      try {
        const response = await fetch(
          `http://localhost:3001/api/articles/${username}/${articleSlug}`
        );
        if (!response.ok) {
          throw new Error("Article not found");
        }
        const data = await response.json();
        setArticle({ ...data, author: username });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch article";
        return { error: errorMessage };
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [username, articleSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">
            Article not found
          </p>
          <Button asChild>
            <a href="/">Go back home</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 md:py-16">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-8 -ml-2"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <p>{article.author}</p>
        </Button>

        {/* Author and Title */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {article.title}
          </h1>
          <span>{new Date().toLocaleString()}</span>
        </div>

        {/* Markdown Content */}
        <article className="react-markdown" data-color-mode="dark">
          <MDEditor.Markdown
            source={article.content}
            style={{
              backgroundColor: "transparent",
              color: "inherit",
              padding: 0,
            }}
          />
        </article>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="py-4">
          <div className="flex justify-center items-center">
            <Button variant="ghost" className="text-lg font-semibold" asChild>
              <Link to="/">
                <span className="text-base font-semibold">writtenbyme</span>
              </Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
