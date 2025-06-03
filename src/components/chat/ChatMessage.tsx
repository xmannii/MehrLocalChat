import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IconMehr } from '@/components/ui/icons';
import { Markdown } from '@/components/ui/markdown';
import { Brain, Loader2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

// Function to detect if text contains RTL characters
const isRTL = (text: string) => {
  const rtlRegex = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
};

// Function to parse content with think tags
const parseThinkContent = (content: string) => {
  const thinkRegex = /<think>([\s\S]*?)(<\/think>|$)/g;
  let match;
  let thinkingContent = '';
  let mainContent = content;
  let isThinking = false;

  // Extract thinking content
  while ((match = thinkRegex.exec(content)) !== null) {
    thinkingContent += match[1];
    // Check if think tag is not closed (still thinking)
    if (!match[2] || match[2] !== '</think>') {
      isThinking = true;
    }
  }

  // Remove think tags from main content
  mainContent = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  
  // If there's unclosed think tag, remove it from main content
  mainContent = mainContent.replace(/<think>[\s\S]*$/g, '').trim();

  return {
    thinkingContent: thinkingContent.trim(),
    mainContent,
    isThinking,
    hasThinking: thinkingContent.length > 0
  };
};

export function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  const { t } = useTranslation();
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isRightAligned = isRTL(content) || role === 'user';
  
  const parsedContent = useMemo(() => {
    if (role === 'assistant') {
      return parseThinkContent(content);
    }
    return { thinkingContent: '', mainContent: content, isThinking: false, hasThinking: false };
  }, [content, role]);

  // Copy function
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(parsedContent.mainContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={role}
      >
        <div className={cn(
          "flex gap-4 w-full",
          isRightAligned ? "flex-row-reverse" : "flex-row"
        )}>
          <div className={cn(
            "size-8 flex items-center rounded-lg justify-center ring-1 shrink-0 ring-border bg-background",
            { "animate-pulse": isLoading }
          )}>
            {role === 'assistant' ? (
              <div className="translate-y-px">
                <IconMehr className="size-4 text-primarytext-primary" />
              </div>
            ) : (
              <div className="translate-y-px">
                <svg className="size-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            )}
          </div>

          <div className={cn(
            "flex flex-col gap-2 w-full min-w-0",
            isRightAligned ? "items-end" : "items-start"
          )}>
            {/* Thinking section */}
            {role === 'assistant' && parsedContent.hasThinking && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[90%]"
              >
                <div className="bg-muted border border-border rounded-lg mb-2" dir='auto'>
                  {/* Thinking header - always visible */}
                  <button
                    onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
                    className={cn(
                      "w-full flex items-center p-2 hover:bg-muted/80 rounded-lg transition-colors",
                      isRightAligned ? "flex-row-reverse" : "flex-row"
                    )}
                    disabled={parsedContent.isThinking}
                  >
                    <div className={cn(
                      "flex items-center gap-2",
                      isRightAligned ? "flex-row-reverse" : "flex-row"
                    )}>
                      {parsedContent.isThinking ? (
                        <Loader2 className="size-3 text-muted-foreground animate-spin" />
                      ) : (
                        <Brain className="size-3 text-muted-foreground" />
                      )}
                      <span className="text-xs font-medium text-muted-foreground" dir='auto'>
                        {parsedContent.isThinking ? t('chat.thinking') : t('chat.thought')}
                      </span>
                    </div>
                    {!parsedContent.isThinking && (
                      <div className={cn(
                        "flex items-center ml-auto",
                        isRightAligned && "mr-auto ml-0"
                      )}>
                        {isThinkingExpanded ? (
                          <ChevronUp className="size-3 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-3 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Thinking content - collapsible */}
                  <AnimatePresence>
                    {(isThinkingExpanded || parsedContent.isThinking) && parsedContent.thinkingContent && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-2 pb-2 text-xs text-muted-foreground border-t border-border pt-2 mt-1" dir='auto'>
                          <Markdown>{parsedContent.thinkingContent}</Markdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Main response */}
            {parsedContent.mainContent && (
              <div className="w-full max-w-[90%]">
                <div dir="auto" className={cn(
                  'break-words',
                  role === 'user' ? 'bg-primary text-primary-foreground px-4 py-3 rounded-xl' : 'bg-muted px-4 py-3 rounded-xl'
                )}>
                  <Markdown>{parsedContent.mainContent}</Markdown>
                </div>
                
                {/* Copy button for AI messages */}
                {role === 'assistant' && parsedContent.mainContent && (
                  <div className={cn(
                    "flex mt-2",
                    isRightAligned ? "justify-end" : "justify-start"
                  )}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      dir='auto'
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-3 mr-1 ml-1" />
                          {t('chat.copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="size-3 mr-1 ml-1" />
                          {t('chat.copy')} 
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

