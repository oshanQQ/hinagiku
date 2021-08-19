import type { NextComponentType } from "next";
import Link from "next/link";

const Header: NextComponentType = () => {
  return (
    <>
      <div className="pb-12 text-4xl">
        <Link href="/">o-xian blog</Link>
      </div>
    </>
  );
};

export default Header;
