import type { Article } from "@/types/article";
import MDEditor from "@uiw/react-md-editor";
import "./ArticleEditor.css";

type Props = {
  article: Article;
  onContentChange: (content: string) => void;
};

export default function ArticleEditor({ article, onContentChange }: Props) {
  return (
    <div className="article-editor dark flex h-full w-full gap-4">
      <MDEditor
        className="flex-1"
        value={article.content}
        onChange={(val) => onContentChange(val || "")}
        visibleDragbar={false}
      />
    </div>
  );
}
