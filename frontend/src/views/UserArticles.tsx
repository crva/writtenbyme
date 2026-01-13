import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { useArticle } from "@/stores/articleStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export default function UserArticles() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const articles = useArticle((state) => state.articles);
  const loading = useArticle((state) => state.loading);
  const fetchUserArticles = useArticle((state) => state.fetchUserArticles);

  useEffect(() => {
    if (!username) return;
    fetchUserArticles(username);
  }, [username, fetchUserArticles]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 md:py-16">
          <div className="flex items-center justify-center h-40">
            <p className="text-lg text-muted-foreground">Loading articles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 md:py-16">
        {/* Username */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{username}</h1>
          <Separator />
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {articles.length === 0 ? (
            <p className="text-muted-foreground">No articles yet</p>
          ) : (
            articles.map((article) => (
              <button
                key={article.id}
                onClick={() => navigate(`/${username}/${article.slug}`)}
                className="w-full text-left hover:opacity-70 transition-opacity py-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">{article.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(article.updatedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
