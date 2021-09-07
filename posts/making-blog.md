---
title: "Next.jsでブログを作った"
date: "2021-09-07"
---

# はじめに

今回、Next.js を使ってブログを作りました(あなたが今見ているこのブログやで)。本記事ではブログを作った時の要点などをまとめていきたいと思います。

# ブログ概要

ブログの名前は`hinagiku🌼`にしました。理由は語感がかっこいいからです ~~適当~~ 。記事のデータとしてマークダウンファイルを使用しています。またスタイリングには TailwindCSS を使用しています。GitHub のリポジトリを載せておきます。

[oshanQQ/hinagiku: 🌼o-xian blog](https://github.com/oshanQQ/hinagiku)

# 実装

今回のブログで必要な機能は以下の通りです。

- マークダウンファイルのメタデータ部分を取得して、記事一覧ページに表示する。
- 記事本文データを取得して、記事詳細ページに表示する。

### 記事一覧ページ

まずは、記事一覧ページを実装していきます。

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

マークダウンファイルからメタデータを取得するのは`getStaticProps()`です。

```tsx
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
```

これは Next.js が提供する機能のひとつで、非同期で`export`すると SSG(Server Side Generate)ができます。`posts`ディレクトリ内にあるマークダウンファイルの名前を配列`files`として取得し、`files`の各要素に対してメタデータ部分とスラグを抽出します。これらを新たな配列`posts`に格納し、関数の返り値としています。返り値`props`は、`Home`関数の引数として渡され、記事のタイトルと投稿日時がページに表示されるという流れです。
マークダウンファイル内のメタデータは`---`で囲まれた部分(フロントマターといいます)に記述し、取得には[gray-matter](https://github.com/jonschlinkert/gray-matter)を使っています。一覧ページに必要なのは記事のタイトルと投稿日時、それから各記事へのパスとなるスラグのみなので、取ってくるデータとしては十分です。

### 記事詳細ページ

各記事のページでは、メタデータだけではなく記事本文も必要です。記事詳細ページを実装していきます。

```tsx
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

export default Post;
```

`gray-matter`の`matter()`は、メタデータを保持する`data`とメタデータより後の文字列を保持する`content`をオブジェクトとして返すので、記事本文を取得するには`content`にアクセスすればいい、ということになります。この処理を、記事一覧ページ同様`getStaticProps`に記述し、記事のデータを`Post`関数に渡しています。

このファイルの名前は`[slug].tsx`となっており、Next.js の機能でパスを動的に変えることができます。このパスは、`getStaticPaths`の返り値によって変更されます。

# 作ってみて

このブログを作る以前は Gatsby.js 製のブログスターターを使ってたんですが、カスタマイズ性に乏しく運用のモチベが下がってたんですよね。フルスクラッチで実装することで全体を把握することができ、格段にメンテしやすくなりました。OGP などの機能はまだ実装していないので、気が向いたら実装したいと思います。

#
