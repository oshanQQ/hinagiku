import { NextComponentType } from "next";
import React, { ReactNode } from "react";

import Header from "../components/Header";
import Footer from "./Footer";

const Layout: NextComponentType = ({ children }) => {
  return (
    <>
      <div className="max-w-4xl px-8 py-8 mx-auto text-gray-800 font-ja">
        <Header />
        <div>{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
