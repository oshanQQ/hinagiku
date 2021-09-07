---
title: "Next.js + TailwindCSS + Markdownでブログを作った"
date: "2021-09-07"
---

# はじめに

今回、Next.js を使ってブログを作りました。そう、今あなたが見ているこのブログです！！本記事ではブログを実装した際の実装ポイントや注意点などをまとめていきたいと思います。

# 経緯

以前は [Gatsby.js](https://www.gatsbyjs.com/) のブログスターターを使っていました。Gatsby で作成された Web サイトはパフォーマンスが高く、プラグインを組み合わせることで簡単に機能拡張ができます。できるんですが、機能を拡張していくうちに多くの処理が複数のプラグインで隠ぺいさせるようになり、メンテナンスがしにくくなっていきました。さらに公式プラグインでありながら開発が止まっているものも散見され、機能を追加する際に「開発が止まっていないプラグインを探し続ける」という不毛な状況に陥りやすくなりました。

このように Gatsby では機能拡張に難があると感じるようになったため、「じゃあフルスクラッチでイチからブログを実装するか」となりました。

# ブログ概要

ブログの名前は`hinagiku🌼`にしました。理由は語感がかっこいいからです。語感は大事。

実装には React のフレームワークである[Next.js](https://nextjs.org/)を採用し、スタイリングには [TailwindCSS](https://tailwindcss.com/) を使うことにしました。なお、記事のデータには Markdown ファイルを使用し、ホスティングは[Vercel](https://vercel.com/)でよしなにやってもらいました。GitHub のリポジトリを載せておきます。

[oshanQQ/hinagiku: 🌼o-xian blog](https://github.com/oshanQQ/hinagiku)

# 実装

### Markdown ファイルの取り扱い

記事データとして Markdown ファイルを使うため、[reack-markdown](https://github.com/remarkjs/react-markdown)は導入必須でしょう。`react-markdown` が提供する`<ReactMarkdown>`コンポーネントに文字列データを渡すと、Markdown ファイルを HTML に変換できます。またコードブロックのシンタックスハイライトもよしなにやってくれます。便利～。

ということで、まずは Markdown ファイルを変換してくれるコンポーネントを実装します。

```tsx
/// Markdown.tsx
import ReactMarkdown from "react-markdown";
import { FunctionComponent } from "react";
import remarkGfm from "remark-gfm";

import CodeBlock from "./CodeBlock";

interface IProps {
  content: string;
}

const Markdown: FunctionComponent<IProps> = ({ content }) => {
  const components = {
    code: CodeBlock,
  };

  return (
    <div className="markdown">
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
```

取り消し線やテーブルは GitHub 上でのマークダウン方言なので、`ReactMarkdown`単体では対応していません。そのため`react-gfm`を別途 `import` して対応します。ちなみに 2021/09/07 時点で、`react-gfm`はデフォルトで使用すると　**クソデカ** 型エラーを吐きます。そのため[この記事](https://zenn.dev/tomi/articles/2021-08-08-next-issue)を参考に、`react-gfm`のバージョンを`2.0.0`から`1.0.0`にダウングレードして使用しています。ここかなり時間溶かしました。

シンタックスハイライト込みのコードブロックも実装していきます。

```tsx
// CodeBlock.tsx
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
    <div className="text-sm">
      <SyntaxHighlighter style={dracula} language={lang}>
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
```

ここでもひとつ注意なのですが、Next.js で TypeScript を使っている場合はそのまま使うと`<SyntaxHighlighter>`の型エラーが出ます。今回は[こちらの記事](https://goodlife.tech/posts/react-markdown-code-highlight.html)を参考に、型情報を付与しました。 ~~React 周りのライブラリ不安定ｽｷﾞｨ~~

こんな感じで、Markdown ファイルを取り扱っていきました。

### 記事一覧ページ

この調子で記事一覧ページも実装していきます。一覧ページで表示するのは記事のタイトルと投稿日時です。Markdown ファイルには、フロントマター(`---`で囲まれた部分)でメタデータ(タイトルと投稿日時)を記述してます。こんな感じになります。

```md
---
title: "走れメロス"
date: "1940-03-25"
---

メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。
```

これらの情報を取得できればいいですね。今回は、[gray-matter](https://www.npmjs.com/package/gray-matter)というライブラリでメタデータを取得します。

```tsx
// index.tsx
import type { NextPage } from "next";
import Link from "next/link";
import fs from "fs";
import matter from "gray-matter";

import { PostMetaData } from "../interfaces/interfaces";
import { sortByDate } from "../utils/sortByDate";

interface IProps {
  posts: PostMetaData[];
}

const Home: NextPage<IProps> = ({ posts }) => {
  posts.sort(sortByDate);

  return (
    <div>
      {posts.map((post, i) => (
        <div key={i} className="py-4 pl-4 cursor-pointer">
          <Link href={`/posts/${post.slug}`} passHref>
            <div>
              <div className="mb-2 text-xl font-bold">{post.title}</div>
              <div className="ml-4 text-xl">{post.date}</div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export async function getStaticProps() {
  const files = fs.readdirSync("posts");

  let posts = files.map((file) => {
    const data = fs.readFileSync(`posts/${file}`).toString();

    return {
      ...matter(data).data,
      slug: file.split(".")[0],
    };
  });

  return {
    props: {
      posts: posts,
    },
  };
}

export default Home;
```

`getStaticProps()`は Next.js が提供する機能のひとつで、非同期で`export`すると SSG(Server Side Generate)ができます。Markdown ファイルは`posts`ディレクトリ直下にあるため、JavaScript の`readdirSync()`で Markdown ファイルの名前を配列`files`に格納しています。この各要素を対象に Markdown ファイルの中身を取得し、`matter()`でメタデータを取得します。`matter()`はメタデータを保持する`data`と、メタデータより後の文字列を保持する`content`をオブジェクトとして返すので、メタデータを取得するには`matter().data`にアクセスすればいい、ということになります。

さらに、記事一覧ページでは記事は投稿日順に並んでほしいです。そのため、ページに描画する前にソートを行う必要があります。今回はソートする関数を別途定義し、先の`getStaticProps()`が返した配列を日付順でソートします。

```ts
// sortByDate.ts
export const sortByDate = (a: { date: string }, b: { date: string }) => {
  if (a.date < b.date) {
    return 1;
  }
  if (a.date > b.date) {
    return -1;
  }
  return 0;
};
```

これで描画する準備が整いました。あとは TailwindCSS でちょこちょこスタイリングしながらページに表示すればおけです。

### 記事詳細ページ

ブログを実装する上で記事詳細ページは必須です。ということで、記事本文データを取得して表示していきます。

```tsx
// [slug].tsx
import type { NextPage } from "next";
import fs from "fs";
import matter from "gray-matter";

import { PostInfo } from "../../interfaces/interfaces";

import Markdown from "../../components/Markdown";

interface IProps {
  post: PostInfo;
}

const Post: NextPage<IProps> = ({ post }) => {
  return (
    <>
      <div className="mb-4 text-2xl font-bold text-center">
        {post.meta.title}
      </div>
      <div className="mb-6 text-center">{post.meta.date}</div>
      <Markdown content={post.content} />
    </>
  );
};

export async function getStaticPaths() {
  const files = fs.readdirSync("posts");
  const paths = files.map((file) => ({
    params: {
      slug: file.split(".")[0],
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ ...ctx }) {
  const { slug } = ctx.params;

  const content = fs.readFileSync(`posts/${slug}.md`).toString();

  const info = matter(content);

  const post = {
    meta: {
      ...info.data,
      slug,
    },
    content: info.content,
  };

  return {
    props: {
      post: post,
    },
  };
}

export default Post;
```

`getStaticPaths()`では、記事のスラグ情報を取得して、記事データのパスの配列として返しています。ここで取得したパスは`getStaticProps()`に引数として渡されます。つまり、`({ ..ctx })`の部分に`getStaticPaths`の返り値`path`で指定した値が入ります。  
このパス情報の他に、`getStaticProps()`では`matter().content`にアクセスして記事本文を取得しています。

これらの処理を記述することで記事本文を`<Markdown>`に渡すことができます。さらに`[slug].tsx`の`[slug]`の部分に動的にパスを割り当てて SSG できるようになります。

# 作ってみて

全体的に Next.js という巨人の肩に乗る形になりました。Next.js の`getStaticProps()`や`getStaticPaths()`、その他の npm ライブラリがマジで便利でしたし、短い時間でブログを実装できました。フルスクラッチでブログを実装する際には、全力で Next.js を推していきたいと思います。Next.js ｻｲｺｰ!

# 参考

- [How To Make A Next JS Blog With Markdown And TypeScript | by Cleggacus | Geek Culture | Medium](https://medium.com/geekculture/how-to-make-a-next-js-blog-with-markdown-and-typescript-1624a54f1b9e)
- [remarkjs/react-markdown: Markdown component for React](https://github.com/remarkjs/react-markdown)
- [gray-matter/package.json at master · jonschlinkert/gray-matter](https://github.com/jonschlinkert/gray-matter/blob/master/package.json)
- [react-markdown でコードをシンタックスハイライトさせる | Goodlife.tech](https://goodlife.tech/posts/react-markdown-code-highlight.html)
- [react-markdown で詰まったのでメモ](https://zenn.dev/tomi/articles/2021-08-08-next-issue)
- [Next.js 9.3 の変更点 - the2g](https://the2g.com/post/nextjs-9-3)
