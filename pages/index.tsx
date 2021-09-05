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
