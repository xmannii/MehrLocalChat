import React, { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '@/components/chat/CodeBlock';

// Function to detect if text contains RTL characters
const hasRTLCharacters = (text: string) => {
  const rtlRegex = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
};

// Function to determine text direction
const getTextDirection = (text: string | React.ReactNode) => {
  if (typeof text !== 'string') return undefined;
  return hasRTLCharacters(text) ? 'rtl' : 'ltr';
};

const components: Partial<Components> = {
  // @ts-expect-error: The type for the 'components' object is not fully compatible with the expected type from 'react-markdown'.
  code: CodeBlock,
  pre: ({ children }) => <>{children}</>,
  ol: ({ children, ...props }) => {
    const dir = getTextDirection(children as string);
    return (
      <ol className="list-decimal list-inside pl-1" dir={dir} {...props}>
        {children}
      </ol>
    );
  },
  li: ({  children, ...props }) => {
    const dir = getTextDirection(children as string);
    return (
      <li className="py-1" dir={dir} {...props}>
        {children}
      </li>
    );
  },
  ul: ({ children, ...props }) => {
    const dir = getTextDirection(children as string);
    return (
      <ul className="list-disc list-inside pl-1" dir={dir} {...props}>
        {children}
      </ul>
    );
  },
  strong: ({  children, ...props }) => {
    const dir = getTextDirection(children as string);
    return (
      <span className="font-semibold" dir={dir} {...props}>
        {children}
      </span>
    );
  },
  a: ({ children, ...props }) => {
    const dir = getTextDirection(children as string);
    return (
      <a
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        dir={dir}
        {...props}
      >
        {children}
      </a>
    );
  },
  h1: ({ children, ...props }) => {
    const dir = getTextDirection(children as string);
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" dir={dir} {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    const dir = getTextDirection(children as string);
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" dir={dir} {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    const dir = getTextDirection(children as string);
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" dir={dir} {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => {
    const dir = getTextDirection(children as string);
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" dir={dir} {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ children, ...props }) => {
    const dir = getTextDirection(children as string);
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" dir={dir} {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ children, ...props }) => {
    const dir = getTextDirection(children as string);
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" dir={dir} {...props}>
        {children}
      </h6>
    );
  },
  p: ({ children, ...props }) => {
    const dir = getTextDirection(children as string);
    return (
      <p dir={dir} {...props}>
        {children}
      </p>
    );
  },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components} >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);