import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IconMehr } from '@/components/ui/icons';
import { Markdown } from '@/components/ui/markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

// Function to detect if text contains RTL characters (Remove if not needed i just needed it for persian LOL)
const isRTL = (text: string) => {
  const rtlRegex = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
};

export function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  const isRightAligned = isRTL(content) || role === 'user';
  
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
            <div dir="auto"  className={cn(
              'max-w-[90%] break-words',
              role === 'user' ? 'bg-primary text-primary-foreground px-4 py-3 rounded-xl' : 'bg-muted px-4 py-3 rounded-xl'
            )}>
          <Markdown>{content}</Markdown>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

