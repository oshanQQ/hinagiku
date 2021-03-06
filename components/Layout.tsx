import { NextComponentType } from "next";
import React from "react";

import Header from "../components/Header";
import Footer from "./Footer";

const Layout: NextComponentType = ({ children }) => {
  return (
    <>
      <div className="max-w-4xl p-8 mx-auto text-gray-600 font-ja">
        <Header />
        <div>{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
