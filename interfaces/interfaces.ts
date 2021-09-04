interface PostMetaData {
  title: string;
  slug: string;
  date: string;
}

interface PostInfo {
  meta: PostMetaData;
  content: string;
}

export type { PostMetaData, PostInfo };
