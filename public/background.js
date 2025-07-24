
// Background script for TOKUN extension
console.log('TOKUN Prompt Optimizer: Background script loaded');

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'optimize_prompt') {
    // Get the API key from storage
    chrome.storage.local.get(['llm_provider', 'openai_key', 'perplexity_key', 'anthropic_key', 'google_key'], (result) => {
      const provider = result.llm_provider || 'openai';
      const apiKey = result[`${provider}_key`] || '';
      
      if (!apiKey) {
        sendResponse({ 
          success: false, 
          error: 'No API key found' 
        });
        return;
      }
      
      // Call the API to optimize the prompt
      optimizePromptWithAPI(message.text, provider, apiKey)
        .then(data => {
          sendResponse({ success: true, data });
        })
        .catch(error => {
          console.error('Optimization error:', error);
          sendResponse({ 
            success: false, 
            error: error.message || 'Error optimizing prompt' 
          });
        });
    });
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
  
  if (message.action === 'open_popup') {
    chrome.action.openPopup();
  }
});

// Function to optimize prompt using the appropriate API
async function optimizePromptWithAPI(text, provider, apiKey) {
  let apiUrl, requestBody;
  
  switch (provider) {
    case 'openai':
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      requestBody = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at optimizing text to use fewer tokens while preserving the original meaning. 
            Your task is to optimize the input text to be more concise, using fewer tokens, but preserving the core meaning.
            Return a JSON object with the following structure:
            {
              "optimizedText": "the optimized version of the input text",
              "suggestions": ["suggestion 1 for further optimization", "suggestion 2", "suggestion 3"]
            }`
          },
          {
            role: 'user',
            content: text
          }
        ],
        response_format: { type: "json_object" }
      };
      break;
      
    case 'perplexity':
      apiUrl = 'https://api.perplexity.ai/chat/completions';
      requestBody = {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are an expert at optimizing text to use fewer tokens while preserving the original meaning. 
            Your task is to optimize the input text to be more concise, using fewer tokens, but preserving the core meaning.
            Return a JSON object with the following structure:
            {
              "optimizedText": "the optimized version of the input text",
              "suggestions": ["suggestion 1 for further optimization", "suggestion 2", "suggestion 3"]
            }`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      };
      break;
      
    // Add other providers as needed
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error optimizing prompt');
    }
    
    let result;
    try {
      // For OpenAI and Perplexity responses
      if (data.choices && data.choices[0] && data.choices[0].message) {
        result = JSON.parse(data.choices[0].message.content);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (e) {
      throw new Error('Invalid response format from API');
    }
    
    // Simple token and word count
    const tokens = estimateTokens(result.optimizedText);
    const words = result.optimizedText.split(/\s+/).filter(Boolean).length;
    
    return {
      optimizedText: result.optimizedText,
      tokens: tokens,
      words: words,
      suggestions: result.suggestions || []
    };
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

// Helper function to estimate token count
function estimateTokens(text) {
  // Simple estimation - actual tokens are more complex
  const words = text.split(/\s+/).filter(Boolean).length;
  const tokenMultiplier = 1.3;
  return Math.round(words * tokenMultiplier);
}
