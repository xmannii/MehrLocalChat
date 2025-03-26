import React from 'react';
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { ModelSelector } from "../ModelSelector";
import { PlusIcon } from 'lucide-react';

interface Model {
  name: string;
  details: {
    parameter_size: string;
    family: string;
  };
}

interface ChatHeaderProps {
  selectedModel: string;
  onNewChat: () => void;
  isLoading: boolean;
  models: Model[];
  onModelChange: (value: string) => void;
}

export function ChatHeader({ 
  selectedModel, 
  onNewChat, 
  isLoading,
  models,
  onModelChange,
}: ChatHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between py-2 px-4 border-b sticky top-0 bg-background z-10 w-full">
      <div className="flex items-center">
        <ModelSelector
          models={models}
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          disabled={isLoading}
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNewChat}
          disabled={isLoading}
          className="rounded-xl flex items-center"
        >
          <PlusIcon className="w-4 h-4 inline-block mr-1" />
          {t("chat.newChat")}
        </Button>
      </div>
    </div>
  );
} 