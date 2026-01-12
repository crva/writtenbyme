import { Button } from "@/components/ui/button";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

// Example user data (replace with API call later)
const exampleUsers: {
  [key: string]: {
    username: string;
    articles: { title: string; content: string }[];
  };
} = {
  john: {
    username: "john",
    articles: [
      {
        title: "Getting Started with React",
        content: `# A demo of \`react-markdown\`

\`react-markdown\` is a markdown component for React.

👉 Changes are re-rendered as you type.

👈 Try writing some markdown on the left.

## Overview

* Follows [CommonMark](https://commonmark.org)
* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
* Lets you define your own components (to render \`MyHeading\` instead of \`'h1'\`)
* Has a lot of plugins

## Contents

Here is an example of a plugin in action
([\`remark-toc\`](https://github.com/remarkjs/remark-toc)).
**This section is replaced by an actual table of contents**.

## Syntax highlighting

Here is an example of a plugin to highlight code:
[\`rehype-starry-night\`](https://github.com/rehypejs/rehype-starry-night).

\`\`\`js
import React from 'react'
import ReactDom from 'react-dom'
import {MarkdownHooks} from 'react-markdown'
import rehypeStarryNight from 'rehype-starry-night'

const markdown = \`
# Your markdown here
\`

ReactDom.render(
  <MarkdownHooks rehypePlugins={[rehypeStarryNight]}>{markdown}</MarkdownHooks>,
  document.querySelector('#content')
)
\`\`\`

Pretty neat, eh?

## GitHub flavored markdown (GFM)

For GFM, you can *also* use a plugin:
[\`remark-gfm\`](https://github.com/remarkjs/react-markdown#use).
It adds support for GitHub-specific extensions to the language:
tables, strikethrough, tasklists, and literal URLs.

These features **do not work by default**.
👆 Use the toggle above to add the plugin.

| Feature    | Support              |
| ---------: | :------------------- |
| CommonMark | 100%                 |
| GFM        | 100% w/ \`remark-gfm\` |

~~strikethrough~~

* [ ] task list
* [x] checked item

https://example.com

## HTML in markdown

⚠️ HTML in markdown is quite unsafe, but if you want to support it, you can
use [\`rehype-raw\`](https://github.com/rehypejs/rehype-raw).
You should probably combine it with
[\`rehype-sanitize\`](https://github.com/rehypejs/rehype-sanitize).

<blockquote>
  👆 Use the toggle above to add the plugin.
</blockquote>

## Components

You can pass components to change things:

\`\`\`js
import React from 'react'
import ReactDom from 'react-dom'
import Markdown from 'react-markdown'
import MyFancyRule from './components/my-fancy-rule.js'

const markdown = \`
# Your markdown here
\`

ReactDom.render(
  <Markdown
    components={{
      // Use h2s instead of h1s
      h1: 'h2',
      // Use a component instead of hrs
      hr(props) {
        const {node, ...rest} = props
        return <MyFancyRule {...rest} />
      }
    }}
  >
    {markdown}
  </Markdown>,
  document.querySelector('#content')
)
\`\`\`

## More info?

Much more info is available in the
[readme on GitHub](https://github.com/remarkjs/react-markdown)!

***

A component by [Espen Hovlandsdal](https://espen.codes/)`,
      },
    ],
  },
};

export default function Article() {
  const { username, articleTitle } = useParams<{
    username: string;
    articleTitle: string;
  }>();
  const [article, setArticle] = useState<{
    title: string;
    content: string;
    author: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with example data
    const loadArticle = async () => {
      if (!username || !articleTitle) return;

      const user = exampleUsers[username];
      if (user) {
        const foundArticle = user.articles.find(
          (a) => a.title.toLowerCase().replace(/\s+/g, "-") === articleTitle
        );
        if (foundArticle) {
          setArticle({ ...foundArticle, author: username });
        }
      }
      setLoading(false);
    };

    loadArticle();

    // TODO: Replace with actual API call
    // const fetchArticle = async () => {
    //   try {
    //     const response = await fetch(
    //       `/api/articles/${username}/${articleTitle}`
    //     );
    //     const data = await response.json();
    //     setArticle(data);
    //   } catch (error) {
    //     console.error("Failed to load article:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchArticle();
  }, [username, articleTitle]);

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
