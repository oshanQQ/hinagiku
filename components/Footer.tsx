import { NextComponentType } from "next";
import { myData } from "../data/myData";

const Footer: NextComponentType = () => {
  return (
    <>
      <div className="flex justify-center pt-12 text-xl">
        ©{new Date().getFullYear()},
        <a href={myData.github.url}>{myData.github.userName}</a>
      </div>
    </>
  );
};

export default Footer;
