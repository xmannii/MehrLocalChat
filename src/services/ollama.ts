import { Message } from '@/types/chat';

interface OllamaRequestOptions {
  model: string;
  messages: Message[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

interface StreamChunkResponse {
  done: boolean;
  message?: {
    content: string;
  };
}

export class OllamaService {
  private apiUrl: string;
  private abortController: AbortController | null = null;

  constructor(apiUrl: string = 'http://localhost:11434') {
    this.apiUrl = apiUrl;
  }

  async fetchModels() {
    try {
      const response = await fetch(`${this.apiUrl}/api/tags`);
      const data = await response.json();
      return data.models;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }

  async sendMessage(options: OllamaRequestOptions, onChunk?: (content: string) => void) {
    this.abortController = new AbortController();

    try {
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
        signal: this.abortController.signal,
      });

      if (options.stream) {
        return this.handleStreamResponse(response, onChunk);
      } else {
        const data = await response.json();
        return data.message.content;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request aborted');
      }
      throw error;
    }
  }

  private async handleStreamResponse(response: Response, onChunk?: (content: string) => void): Promise<string> {
    const reader = response.body?.getReader();
    let fullContent = '';

    if (!reader) {
      throw new Error('No reader available');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          const data = JSON.parse(line) as StreamChunkResponse;
          if (!data.done && data.message?.content) {
            fullContent += data.message.content;
            onChunk?.(fullContent);
          }
        }
      }

      return fullContent;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return fullContent;
      }
      throw error;
    } finally {
      reader.releaseLock();
    }
  }

  stopStreaming() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

export const ollamaService = new OllamaService(); 