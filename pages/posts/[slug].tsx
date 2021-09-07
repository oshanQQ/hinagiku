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
