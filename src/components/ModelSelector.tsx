import React from 'react';
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Model {
  name: string;
  details: {
    parameter_size: string;
    family: string;
  };
}

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onModelChange: (value: string) => void;
  disabled?: boolean;
}
export function ModelSelector({
  models,
  selectedModel,
  onModelChange,
  disabled = false
}: ModelSelectorProps) {
  const { t } = useTranslation();

  return (
    <Select 
      value={selectedModel} 
      onValueChange={onModelChange}
      disabled={disabled}
    >
      <SelectTrigger className="h-8 text-sm min-w-44 w-auto px-4 rounded-md">
        <SelectValue placeholder={t("chat.selectModel")} />
      </SelectTrigger>
      <SelectContent className="p-2 font-sans rounded-md" position="popper" sideOffset={5}>
        {models.map((model) => (
          <SelectItem 
            key={model.name} 
            value={model.name} 
            className="text-sm py-2 px-3 rounded-sm"
          >
            <div className="flex flex-col w-full">
              <span className="text-sm mt-1">{model.name}</span>
              <span className="text-xs text-muted-foreground">
                {model.details.family} ({model.details.parameter_size})
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 