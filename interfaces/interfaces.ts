interface PostMetaData {
  title: string;
  slug: string;
  date: string;
}

interface PostInfo {
  meta: PostMetaData;
  content: string;
}

interface PersonalDataType {
  name: string;
  sitename: string;
  twitter: {
    userName: string;
    url: string;
  };
  github: {
    userName: string;
    url: string;
  };
}

export type { PostMetaData, PostInfo, PersonalDataType };
