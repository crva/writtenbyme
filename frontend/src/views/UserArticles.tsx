import { PageLayout } from "@/components/PageContent";
import { useArticle } from "@/stores/articleStore";
import { Lock } from "lucide-react";
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

  return (
    <PageLayout loading={loading} username={username || ""}>
      {/* Articles List */}
      <div>
        {articles.length === 0 ? (
          <p className="text-muted-foreground">No articles yet</p>
        ) : (
          articles.map((article) => (
            <div
              key={article.id}
              onClick={() => navigate(`/${username}/${article.slug}`)}
              className="w-full text-left opacity-70 hover:opacity-100 transition-opacity mb-4"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg flex-1 min-w-0 truncate">
                    {article.title}
                  </span>
                  {article.status === "locked" && (
                    <Lock className="size-4 shrink-0 text-destructive" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
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
    </PageLayout>
  );
}
