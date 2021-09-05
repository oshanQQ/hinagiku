---
title: "お試し投稿exception"
date: "2020-01-01"
---

- これは
- 連続の
- `list`です

これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。これは連続の**文章**です。

> ahiahi  
> hogehoge

これは[Next.js と Markdown でブログを作るときのメモ](https://zenn.dev/oshanqq/scraps/786663de30d1ab)です。

```tsx
import { CodeComponent } from "react-markdown/src/ast-to-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

const CodeBlock: CodeComponent = ({ node, inline, className, children }) => {
  if (inline) {
    return <code className={className}>{children}</code>;
  }

  const match = /language-(\w+)/.exec(className || "");
  const lang = match && match[1] ? match[1] : "";
  return (
    <SyntaxHighlighter style={dracula} language={lang}>
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
```

Importantly, Next.js lets you **choose** which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.
