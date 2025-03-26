import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { cn } from "@/utils/tailwind";
import { ArrowUpIcon, StopIcon } from "../ui/icons";
import { getLanguage } from '@/helpers/language_helpers';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStopStreaming?: () => void;
  isLoading: boolean;
  isStreaming?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function ChatInput({ 
  onSendMessage, 
  onStopStreaming,
  isLoading,
  isStreaming = false,
  disabled = false,
  value: externalValue,
  onChange: externalOnChange
}: ChatInputProps) {
  const { t } = useTranslation();
  const [internalValue, setInternalValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const language = getLanguage();
  const isRtl = language === 'fa';
  const isControlled = externalValue !== undefined && externalOnChange !== undefined;
  const input = isControlled ? externalValue : internalValue;
  
  // Update the internal value when the external value changes
  useEffect(() => {
    if (isControlled && externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [isControlled, externalValue]);


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (textareaRef.current && !disabled && externalValue) {
      textareaRef.current.focus();
    }
  }, [disabled, externalValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (isControlled && externalOnChange) {
      externalOnChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isLoading || disabled) return;
    
    onSendMessage(input.trim());
    
    if (isControlled && externalOnChange) {
      externalOnChange('');
    } else {
      setInternalValue('');
    }
      
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <div className="flex flex-col">
      <div className="relative">
        <div className={cn(
          "rounded-xl font-regular w-full overflow-hidden",
          "backdrop-blur-xl backdrop-saturate-150 bg-transparent border "
        )}>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.typePlaceholder')}
            className="w-full resize-none pl-4 pr-4 py-3 border-0 focus-visible:ring-0 bg-transparent min-h-[120px] max-h-[200px]"
            dir={isRtl ? "rtl" : "ltr"}
            disabled={isLoading || disabled}
            rows={4}
          />
        </div>
        
        <div className="absolute bottom-3 right-3 p-1">
          {isStreaming ? (
            <Button 
              onClick={onStopStreaming}
              className="rounded-full p-2 h-fit size-10 border"
              variant="destructive"
              aria-label={t('chat.stop')}
            >
              <StopIcon size={16} />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="rounded-full p-2 h-fit size-10 border"
              disabled={!input.trim() || isLoading || disabled}
              variant="outline"
              aria-label={isLoading ? t('chat.sending') : t('chat.send')}
            >
              <ArrowUpIcon size={16} />
            </Button>
          )}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mt-1.5 text-center -mb-4" dir='auto'>
        {t('chat.enterToSend')}
      </div>
    </div>
  );
} 