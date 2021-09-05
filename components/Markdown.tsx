import ReactMarkdown from "react-markdown";
import { FunctionComponent } from "react";

import CodeBlock from "./CodeBlock";

interface IProps {
  content: string;
}

const Markdown: FunctionComponent<IProps> = ({ content }) => {
  const components = {
    code: CodeBlock,
  };

  return (
    <div className="markdown">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
};

export default Markdown;
