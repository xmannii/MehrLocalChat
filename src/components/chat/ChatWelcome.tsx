import React from 'react';
import { useTranslation } from "react-i18next";
import { getLanguage } from '@/helpers/language_helpers';
import { Badge } from "../ui/badge";
import { Brain, Star, Hash } from "lucide-react";

interface ChatWelcomeProps {
  onExampleSelect?: (prompt: string) => void;
}

export function ChatWelcome({ onExampleSelect }: ChatWelcomeProps = {}) {
  const { t } = useTranslation();
  const language = getLanguage();
  const isRTL = language === 'fa';

  const handlePromptClick = (prompt: string) => {
    if (onExampleSelect) {
      onExampleSelect(prompt);
    }
  };

  const examples = [
    { icon: <Brain className="h-4 w-4" />, prompt: t("chat.examplePrompt1") },
    { icon: <Star className="h-4 w-4" />, prompt: t("chat.examplePrompt2") },
    { icon: <Hash className="h-4 w-4" />, prompt: t("chat.examplePrompt3") },
  ];

  return (
    <div className="h-full px-4 py-8 mt-16" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className={`text-${isRTL ? 'right' : 'left'} max-w-3xl ${isRTL ? 'mr-0' : 'ml-0'}`}>
        <h1 className="text-4xl font-bold mb-4" dir="auto">
          {t("chat.howCanIHelp")} <span className="animate-wave inline-block">👋</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8" dir="auto">
          {t("chat.welcomeDescription")}
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {examples.map((example, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer p-2 flex items-center gap-2 hover:bg-accent"
              onClick={() => handlePromptClick(example.prompt)}
            >
              {example.icon}
              <span className="truncate" dir="auto">{example.prompt}</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
} 