# Reasoning Models Support

This chat application automatically detects and displays thinking processes from AI models using `<think>` tags.

## Features

### 🧠 Automatic Think Tag Detection
- **Auto-Detection**: Automatically parses `<think>` tags in AI responses
- **Real-time Thinking**: Shows thinking process as it streams
- **Clean Separation**: Thinking content displayed separately from main response
- **Visual Distinction**: Blue-themed thinking UI with brain/spinner icons

### 🔧 How It Works

1. **Automatic Processing**: 
   - No manual settings required
   - Automatically detects `<think>content</think>` tags in responses
   - Parses thinking content from main response content

2. **Real-time Display**:
   - Shows "Thinking..." with spinner while `<think>` tag is open
   - Displays "Thought Process" with brain icon when thinking is complete
   - Main response appears below thinking section

3. **Supported Models**:
   - Works with any model that uses `<think>` tags
   - Examples: deepseek-r1, reasoning models, custom models with think patterns

### 🎨 UI Components

#### Enhanced ChatMessage
- Automatically parses think tags from message content
- Shows thinking section with animated loader during streaming
- Displays completed thinking with brain icon
- Clean main response below thinking content

#### Thinking Display States
- **Streaming**: Spinner icon + "Thinking..." while tag is open
- **Complete**: Brain icon + "Thought Process" when tag is closed
- **Content**: Full thinking content displayed in blue-themed box

### 🔌 Content Parsing

The implementation automatically handles:

```
Input: "<think>Let me think about this step by step...</think>The answer is 42."

Output:
- Thinking section: "Let me think about this step by step..."
- Main response: "The answer is 42."
```

### 📋 Example Usage

1. **Use a reasoning model** like deepseek-r1
2. **Ask a complex question** 
3. **See automatic thinking display** as the model responds
4. **View both thinking and final answer** cleanly separated

### 🛠 Technical Implementation

- **Regex Parsing**: Uses regex to extract think tag content
- **Real-time Processing**: Handles streaming and non-streaming responses
- **State Detection**: Detects open vs closed think tags
- **Content Separation**: Automatically removes think tags from main content
- **Type Safety**: Clean TypeScript implementation

### 🎯 User Experience

- **Zero Configuration**: Works automatically with any model using think tags
- **Clean Interface**: Thinking and responses are visually separated
- **Real-time Feedback**: Shows thinking progress during streaming
- **Unobtrusive**: Only appears when think tags are detected

### 📝 Tag Format Support

Supports various think tag patterns:
- `<think>content</think>` - Complete thinking
- `<think>partial content` - Streaming thinking (shows spinner)
- Multiple think blocks in single response
- Nested content with markdown support

This implementation provides seamless reasoning display without requiring any user configuration or settings toggles. 