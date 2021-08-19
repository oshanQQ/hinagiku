import { NextComponentType } from "next";

const Footer: NextComponentType = () => {
  return (
    <>
      <div className="flex justify-center pt-12 text-xl">
        ©{new Date().getFullYear()},
        <a href="https://twitter.com/oshanQQ">oshanqq</a>
      </div>
    </>
  );
};

export default Footer;
