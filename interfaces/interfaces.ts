interface ArticleMeta {
  title: string;
  slug: string;
  date: string;
  thumbnail: string;
}

interface ArticleInfo {
  meta: ArticleMeta;
  content: string;
}

export type { ArticleMeta, ArticleInfo };
