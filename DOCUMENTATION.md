

# TOKUN - AI Prompt Optimizer

## Project Overview

TOKUN is a Chrome extension designed to help users optimize their AI prompts by reducing token usage while preserving the original meaning. This tool is particularly useful for users working with OpenAI models and other AI platforms where token efficiency is important for cost savings and improved response times.

## Key Features

- **Real-time Token Analysis**: Instantly count tokens as you type
- **Prompt Optimization**: Receive multiple optimization suggestions with different approaches
- **Categorized Prompt Library**: Access pre-built prompts across various categories
- **Visual Analytics**: Track token usage and savings over time
- **Cross-Platform Compatibility**: Works seamlessly across different AI platforms

## Detailed Functionality

### Token Analysis
- **Real-time Token Counting**: See token usage update as you type
- **Word Count**: Track both tokens and word count simultaneously
- **Cost Estimation**: Calculate potential costs based on current token usage
- **Context Length Monitoring**: Warnings when approaching model context limits
- **Format Analysis**: Identify sections of prompts that use more tokens than necessary

### Prompt Optimization
- **Multiple Optimization Strategies**:
  - Balanced Mode: Maintains meaning while reducing tokens
  - Aggressive Mode: Maximum token reduction with potential meaning changes
  - Enhanced Mode: Improves prompt clarity with minimal token increase
- **Semantic Preservation**: Uses NLP techniques to ensure meaning is preserved
- **Custom Optimization Rules**: Create and save your own optimization rules
- **A/B Testing**: Compare results between original and optimized prompts
- **Formatting Recommendations**: Suggestions for better prompt structure

### Prompt Library
- **Categorized Examples**: Browse prompts by domain (coding, design, business, etc.)
- **Customizable Templates**: Modify existing templates or create your own
- **Favorites System**: Save frequently used prompts for quick access
- **Import/Export**: Share prompt collections with other users
- **Version History**: Track changes to your saved prompts over time
- **Tagging System**: Organize prompts with custom tags and filters

### Analytics Dashboard
- **Token Usage Trends**: Visualize token usage patterns over time
- **Savings Calculator**: See estimated cost savings from optimization
- **Model Comparison**: Compare efficiency across different LLM providers
- **Usage Reports**: Generate exportable reports for billing or analysis
- **Optimization Impact**: Measure effectiveness of different optimization strategies

### Integration Features
- **Clipboard Support**: Quick paste and copy functionality
- **Keyboard Shortcuts**: Streamlined workflows for power users
- **Website Integration**: Use directly on supported AI platform websites
- **API Access**: Programmatic access for developers (premium feature)
- **Team Collaboration**: Share optimized prompts with team members (upcoming)

## Technical Architecture

### Frontend
- Built using React + TypeScript
- Styled with Tailwind CSS for responsive design
- ShadCN UI components for consistent visual elements
- Recharts for data visualization

### Browser Integration
- Chrome Extension API for browser functionality
- Local storage for settings and history persistence
- Content scripts for page interaction (where applicable)

### AI Integration
- OpenAI API for token counting and optimization
- Multiple LLM provider support

## Development Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/tokun.git

# Install dependencies
cd tokun
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
npm run build
```

The built extension will be in the `dist` directory, ready to be loaded into Chrome as an unpacked extension.

## Project Structure

```
tokun/
├── public/              # Static assets and manifest
│   ├── icons/           # Extension icons
│   ├── manifest.json    # Chrome extension manifest
│   └── ...
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API and service integrations
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
└── scripts/             # Build and utility scripts
```

## Configuration

Users need to provide their OpenAI API key in the extension settings to enable token counting and optimization features.

### Advanced Configuration Options
- **Provider Selection**: Choose between different LLM providers
- **Model Selection**: Select specific models for optimization
- **Optimization Presets**: Save custom optimization strategies
- **Token Budget**: Set target token limits for optimization
- **Feedback Settings**: Configure how optimization suggestions are displayed

## Privacy Considerations

- All prompt processing happens locally in the browser
- API keys are stored securely in the browser's local storage
- No prompt data is stored on remote servers
- Optional anonymized analytics for improvement purposes

## Usage Instructions

### Basic Workflow
1. Enter or paste your prompt in the text area
2. View real-time token count and analysis
3. Click "Optimize" to generate optimization options
4. Choose from available optimization strategies
5. Copy or directly use the optimized prompt

### Advanced Features
- Save frequently used prompts to your library
- Create custom templates with variable placeholders
- Share optimized prompts via link or export
- Track optimization history and savings
- Customize optimization rules for specific use cases

## Roadmap

- [ ] Support for additional LLM providers (Claude, Llama, etc.)
- [ ] Advanced optimization strategies
- [ ] Bulk prompt optimization
- [ ] Export/import prompt collections
- [ ] Team collaboration features
- [ ] Enhanced analytics dashboard
- [ ] Plugin system for custom functionality
- [ ] Mobile application version
- [ ] Enterprise deployment options
- [ ] API for developers

## Contributors

This project welcomes contributions from the community. Please see CONTRIBUTING.md for details on how to get involved.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

