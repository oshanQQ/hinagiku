import ReactMarkdown from "react-markdown";
import { FunctionComponent } from "react";
import remarkGfm from "remark-gfm";

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
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
