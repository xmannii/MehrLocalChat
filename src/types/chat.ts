export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface Model {
  name: string;
  details: {
    parameter_size: string;
    family: string;
  };
} 