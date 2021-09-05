import type { NextComponentType } from "next";
import Link from "next/link";

const Header: NextComponentType = () => {
  return (
    <>
      <div className="pb-12 text-4xl font-bold">
        <Link href="/">o-xian.dev</Link>
      </div>
    </>
  );
};

export default Header;
