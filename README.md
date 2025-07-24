
# TOKUN - AI Prompt Optimizer Chrome Extension

## About TOKUN

TOKUN is a Chrome extension that helps you optimize your AI prompts by reducing token usage while preserving meaning.

## Features

- Analyze token usage in real-time
- Optimize prompts to reduce token consumption
- Visual token analytics dashboard
- Suggestions for improved prompt writing

## Installation

### From Chrome Web Store
1. Visit the [TOKUN Chrome Extension](https://chrome.google.com/webstore/detail/tokun/id) in the Chrome Web Store
2. Click "Add to Chrome"
3. Follow the installation prompts

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the project directory

## Usage

1. Click the TOKUN icon in your browser's extension bar
2. Enter your OpenAI API key in the settings
3. Type your prompt in the input field
4. Click "Optimize" to get a token-efficient version of your prompt
5. View savings and suggestions in the dashboard

## Development

```sh
# Install dependencies
npm i

# Start the development server
npm run dev

# Build the extension
npm run build
```

## Privacy

TOKUN processes all data locally in your browser. Your API key and prompts are never stored on remote servers.
