import type { NextComponentType } from "next";
import Link from "next/link";

import { myData } from "../data/myData";

const Header: NextComponentType = () => {
  return (
    <>
      <div className="pb-12 text-4xl font-bold text-green-600">
        <Link href="/">{myData.sitename}</Link>
      </div>
    </>
  );
};

export default Header;
