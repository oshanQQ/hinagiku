import type { NextPage } from "next";
import Link from "next/link";
import fs from "fs";
import matter from "gray-matter";
import { PostMetaData } from "../interfaces/interfaces";

interface IProps {
  posts: PostMetaData[];
}

const Home: NextPage<IProps> = ({ posts }) => {
  return (
    <div>
      {posts.map((post, i) => (
        <div key={i} className="py-4 pl-4 border-b-2 cursor-pointer">
          <Link href={`/posts/${post.slug}`} passHref>
            <div>
              <div className="mb-2 text-2xl">{post.title}</div>
              <div className="ml-4 text-lg">{post.date}</div>
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

  console.log(posts);
  return {
    props: {
      posts: posts,
    },
  };
}

export default Home;
