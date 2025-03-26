'use client';

import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import React from 'react';
import type { Components } from 'react-markdown';

type CodeProps = Components['code'];

interface CodeBlockProps extends Omit<CodeProps, 'node'> {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function CodeBlock({
  inline = false,
  className = '',
  children,
  ...props
}: CodeBlockProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeContent = String(children).replace(/\n$/, '');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isMounted) {
    return null;
  }

  if (!inline) {
    if (!language) {
      return (
        <code className="not-prose text-sm p-4 whitespace-pre-wrap break-words">
          {codeContent}
        </code>
      );
    }
    return (
      <div className="not-prose flex flex-col relative border rounded-lg bg-card shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted">
          <span className="text-xs font-semibold text-muted-foreground capitalize">
            {language}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 hover:bg-background/60"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
        <div className="overflow-x-auto w-full bg-zinc-950 dark:bg-background/95 rounded-b-lg [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 [-ms-overflow-style:none] [scrollbar-width:none] [&_pre]:!overflow-x-auto [&_pre]:![&::-webkit-scrollbar]:hidden [&_pre]:![-ms-overflow-style:none] [&_pre]:![scrollbar-width:none]">
          <SyntaxHighlighter
            {...props}
            language={language}
            style={vscDarkPlus}
            className="text-[13px] min-w-full !scrollbar-none"
            customStyle={{
              padding: '1rem',
              margin: 0,
              background: 'transparent',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: '1.6',
              fontFamily: 'var(--font-mono)',
              overflowX: 'auto',
              msOverflowStyle: 'none'
            }}
            wrapLines={true}
            showLineNumbers={true}
            lineNumberStyle={{
              minWidth: '2.5em',
              paddingRight: '1em',
              color: '#666',
              textAlign: 'right',
            }}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  } else {
    return (
      <code
        className={`${className} text-[13px] bg-muted/60 py-[0.2rem] px-[0.33rem] rounded-md border-[0.5px] border-border my-0.5 whitespace-pre-wrap break-words font-mono`}
        {...props}
      >
        {children}
      </code>
    );
  }
}