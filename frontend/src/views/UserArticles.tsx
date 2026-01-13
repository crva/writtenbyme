import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
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
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
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
        <div className="mb-4">
          <h4 className="text-2xl md:text-2xl font-bold mb-4 text-center">
            <span>articles written by </span>
            <span className="text-primary">{username}</span>
          </h4>
          <Separator />
        </div>

        {/* Articles List */}
        <div>
          {articles.length === 0 ? (
            <p className="text-muted-foreground">No articles yet</p>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                onClick={() => navigate(`/${username}/${article.slug}`)}
                className="w-full text-left opacity-70 hover:opacity-100 transition-opacity"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg">{article.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(article.updatedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
