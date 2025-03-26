import React from 'react';
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ChatSettingsProps {
  streaming: boolean;
  temperature: number;
  maxTokens: number;
  onStreamingChange: (value: boolean) => void;
  onTemperatureChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatSettings({
  streaming,
  temperature,
  maxTokens,
  onStreamingChange,
  onTemperatureChange,
  onMaxTokensChange,
  open,
  onOpenChange,
}: ChatSettingsProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] font-yekan-bakh" dir='auto'>
        <DialogHeader>
          <DialogTitle className='text-center'>{t('chatSettings.title')}</DialogTitle>
          <DialogDescription className='text-center'>
            {t('chatSettings.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="streaming">{t('chatSettings.streaming')}</Label>
              <Switch
                id="streaming"
                checked={streaming}
                onCheckedChange={onStreamingChange}
                dir='auto'
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {streaming ? t('chatSettings.streamingOn') : t('chatSettings.streamingOff')}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{t('chatSettings.temperature')}</Label>
            <div className="flex items-center gap-2">
              <Slider
                min={0}
                max={2}
                step={0.1}
                value={[temperature]}
                onValueChange={([value]) => onTemperatureChange(value)}
                className="flex-1"
              />
              <span className="w-12 text-sm text-muted-foreground">{temperature.toFixed(1)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('chatSettings.temperatureDescription')}
            </p>
          </div>

          <div className="space-y-2">
            <Label>{t('chatSettings.maxTokens')}</Label>
            <div className="flex items-center gap-2">
              <Slider
                min={256}
                max={4096}
                step={256}
                value={[maxTokens]}
                onValueChange={([value]) => onMaxTokensChange(value)}
                className="flex-1"
              />
              <span className="w-12 text-sm text-muted-foreground">{maxTokens}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('chatSettings.maxTokensDescription')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}