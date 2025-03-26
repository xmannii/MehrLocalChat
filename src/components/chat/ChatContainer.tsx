import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatWelcome } from './ChatWelcome';
import { useSettings } from '@/hooks/useSettings';
import { eventEmitter, Events } from '@/helpers/events';
import { ollamaService } from '@/services/ollama';
import { Message, Model } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';



export function ChatContainer() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { settings } = useSettings();
  const [chatSettings, setChatSettings] = useState(settings);
  const [ollamaNotRunning, setOllamaNotRunning] = useState(false);

  useEffect(() => {
    setChatSettings(settings);
  }, [settings]);

  const fetchModels = useCallback(async () => {
    try {
      setOllamaNotRunning(false);
      const fetchedModels = await ollamaService.fetchModels();
      setModels(fetchedModels);
      if (fetchedModels.length > 0 && !selectedModel) {
        setSelectedModel(fetchedModels[0].name);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setOllamaNotRunning(true);
    }
  }, [selectedModel]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  useEffect(() => {
    const handleNewChat = () => {
      setMessages([]);
      setInputValue('');
      setChatSettings(settings);
    };

    eventEmitter.on(Events.NEW_CHAT, handleNewChat);
    return () => {
      eventEmitter.off(Events.NEW_CHAT, handleNewChat);
    };
  }, [settings]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !selectedModel) return;

    const timestamp = new Date().toLocaleTimeString();
    const userMessage: Message = { 
      role: 'user', 
      content, 
      timestamp 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const assistantTimestamp = new Date().toLocaleTimeString();

      const handleChunk = (content: string) => {
        setIsStreaming(true);
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = content;
            return [...newMessages];
          } else {
            return [...newMessages, { 
              role: 'assistant', 
              content,
              timestamp: assistantTimestamp
            }];
          }
        });
      };

      const response = await ollamaService.sendMessage({
        model: selectedModel,
        messages: messages.concat(userMessage).map(({ role, content }) => ({ role, content })),
        stream: chatSettings.streaming,
        temperature: chatSettings.temperature,
        max_tokens: chatSettings.maxTokens,
      }, chatSettings.streaming ? handleChunk : undefined);

      if (!chatSettings.streaming) {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: response,
            timestamp: assistantTimestamp
          }
        ]);
      }
    } catch (error) {
      if (!(error instanceof Error && error.message === 'Request aborted')) {
        console.error('Error:', error);
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: t('chat.errorMessage'),
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [selectedModel, messages, chatSettings, t]);

  const handleStopStreaming = useCallback(() => {
    ollamaService.stopStreaming();
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const hasModels = useMemo(() => models.length > 0, [models]);
  
  const noModelsWarning = useMemo(() => !hasModels && (
    <div dir="auto" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 text-sm rounded-md mb-2 flex justify-between items-center">
      <span>{t('chat.noModelsWarning')}</span>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={fetchModels} 
        className="ml-2"
        disabled={isLoading}
      >
        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
      </Button>
    </div>
  ), [hasModels, t, fetchModels, isLoading]);
  const ollamaNotRunningAlert = useMemo(() => ollamaNotRunning && (
    <div dir="auto" className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 text-sm rounded-md mb-2 flex justify-between items-center">
      <span>{t('chat.ollamaNotRunning')}</span>
      <div className="flex">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={fetchModels} 
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => window.open("https://ollama.com/", "_blank")} 
          className="ml-1"
        >
          {t('chat.installOllama')}
        </Button>
      </div>
    </div>
  ), [ollamaNotRunning, t, fetchModels, isLoading]);

  const messageElements = useMemo(() => (
    messages.map((message, index) => (
      <ChatMessage 
        key={index}
        role={message.role}
        content={message.content}
      />
    ))
  ), [messages]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        selectedModel={selectedModel}
        onNewChat={() => eventEmitter.emit(Events.NEW_CHAT)}
        isLoading={isLoading}
        models={models}
        onModelChange={setSelectedModel}
      />
      
      <div className="flex-1 p-4 overflow-auto min-h-[200px] pt-6 scrollbar-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.length === 0 ? (
          <ChatWelcome onExampleSelect={handleInputChange} />
        ) : (
          <div className="space-y-4">
            {messageElements}
          </div>
        )}
      </div>
      
      <div className="p-4">
        {ollamaNotRunningAlert}
        {noModelsWarning}
        <ChatInput 
          onSendMessage={handleSendMessage}
          onStopStreaming={handleStopStreaming}
          isLoading={isLoading}
          isStreaming={isStreaming}
          disabled={!selectedModel}
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
} 