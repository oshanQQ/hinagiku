import type { NextPage } from "next";
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
        <div key={i}>{post.title}</div>
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
