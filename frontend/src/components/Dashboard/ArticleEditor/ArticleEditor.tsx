import { useArticle } from "@/stores/articleStore";
import type { Article } from "@/types/article";
import MDEditor from "@uiw/react-md-editor";
import "./ArticleEditor.css";

type Props = {
  article: Article;
};

export default function ArticleEditor({ article }: Props) {
  const { updateArticleContent } = useArticle();

  const handleContentChange = (content: string) => {
    updateArticleContent(article.id, content);
  };

  return (
    <div className="article-editor dark flex h-full w-full gap-4">
      <MDEditor
        className="flex-1"
        value={article.content}
        onChange={(val) => handleContentChange(val || "")}
        visibleDragbar={false}
      />
    </div>
  );
}
