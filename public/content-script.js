
// Main content script for TOKUN extension
console.log('TOKUN Prompt Optimizer: Content script loaded');

// Configuration for different platforms
const PLATFORMS = {
  CHATGPT: {
    url: 'chat.openai.com',
    inputSelector: 'textarea[data-id]',
    containerSelector: 'form div',
    buttonPosition: 'beforeend'
  },
  PERPLEXITY: {
    url: 'perplexity.ai',
    inputSelector: 'textarea[placeholder*="Ask"]',
    containerSelector: 'div.flex.w-full',
    buttonPosition: 'beforeend'
  }
};

// Determine current platform
function getCurrentPlatform() {
  const hostname = window.location.hostname;
  if (hostname.includes(PLATFORMS.CHATGPT.url)) return PLATFORMS.CHATGPT;
  if (hostname.includes(PLATFORMS.PERPLEXITY.url)) return PLATFORMS.PERPLEXITY;
  return null;
}

// Create optimization button
function createOptimizeButton(platform) {
  const button = document.createElement('button');
  button.id = 'tokun-optimize-btn';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1EAEDB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tokun-icon">
      <path d="M12 2v4"></path>
      <path d="M12 18v4"></path>
      <path d="M4.93 4.93l2.83 2.83"></path>
      <path d="M16.24 16.24l2.83 2.83"></path>
      <path d="M2 12h4"></path>
      <path d="M18 12h4"></path>
      <path d="M4.93 19.07l2.83-2.83"></path>
      <path d="M16.24 7.76l2.83-2.83"></path>
    </svg>
    <span>Optimize</span>
  `;
  button.title = "Optimize your prompt with TOKUN";
  button.classList.add('tokun-button');
  
  button.addEventListener('click', async (event) => {
    event.preventDefault();
    optimizeCurrentPrompt(platform);
  });
  
  return button;
}

// Main function to optimize the current prompt
async function optimizeCurrentPrompt(platform) {
  // Get textarea element
  const textarea = document.querySelector(platform.inputSelector);
  if (!textarea) {
    console.error('TOKUN: Could not find input textarea');
    return;
  }
  
  // Get the current prompt
  const originalPrompt = textarea.value;
  if (!originalPrompt.trim()) {
    alert('Please enter a prompt before optimizing');
    return;
  }
  
  // Show loading state
  const optimizeBtn = document.getElementById('tokun-optimize-btn');
  const originalBtnText = optimizeBtn.innerHTML;
  optimizeBtn.innerHTML = '<span>Optimizing...</span>';
  optimizeBtn.disabled = true;
  
  try {
    // Get API key from storage
    const apiKey = await getAPIKey();
    if (!apiKey) {
      alert('Please set your API key in the TOKUN extension popup');
      openExtensionPopup();
      return;
    }
    
    // Optimize the prompt
    const optimizedResult = await optimizePrompt(originalPrompt, apiKey);
    
    // Set the optimized prompt in the textarea
    textarea.value = optimizedResult.optimizedText;
    
    // Trigger input event to ensure ChatGPT recognizes the change
    const inputEvent = new Event('input', { bubbles: true });
    textarea.dispatchEvent(inputEvent);
    
    // Focus on the textarea
    textarea.focus();
    
    // Show success notification
    showNotification('Prompt optimized successfully!', 'success');
  } catch (error) {
    console.error('TOKUN optimization error:', error);
    showNotification('Error optimizing prompt. Check extension for details.', 'error');
  } finally {
    // Restore button state
    optimizeBtn.innerHTML = originalBtnText;
    optimizeBtn.disabled = false;
  }
}

// Function to get API key from storage
async function getAPIKey() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['llm_provider', 'openai_key', 'perplexity_key', 'anthropic_key', 'google_key'], (result) => {
      const provider = result.llm_provider || 'openai';
      const key = result[`${provider}_key`] || '';
      resolve(key);
    });
  });
}

// Function to optimize the prompt using extension's API
async function optimizePrompt(text, apiKey) {
  return new Promise((resolve, reject) => {
    // Use extension's popup to optimize
    // This is a workaround since we can't directly access the extension's JS
    chrome.runtime.sendMessage({
      action: 'optimize_prompt',
      text: text
    }, response => {
      if (response && response.success) {
        resolve(response.data);
      } else {
        // Fallback to simple optimization if extension communication fails
        const simpleOptimized = {
          optimizedText: text.replace(/\b(please|kindly|would you|could you|I would like you to)\b/gi, '')
            .replace(/\s+/g, ' ').trim(),
          tokens: Math.floor(text.length * 0.7),
          words: text.split(/\s+/).filter(Boolean).length,
          suggestions: ["Simplified by TOKUN extension"]
        };
        resolve(simpleOptimized);
      }
    });
  });
}

// Helper function to show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `tokun-notification tokun-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('tokun-fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Function to open extension popup
function openExtensionPopup() {
  chrome.runtime.sendMessage({ action: 'open_popup' });
}

// Initialize: Observe DOM for changes to detect input field
function initObserver() {
  const platform = getCurrentPlatform();
  if (!platform) return;
  
  // Initial injection attempt
  setTimeout(injectButton, 1000);
  
  // Set up observer for dynamic content
  const observer = new MutationObserver(() => {
    const button = document.getElementById('tokun-optimize-btn');
    if (!button) {
      injectButton();
    }
  });
  
  // Start observing
  observer.observe(document.body, { childList: true, subtree: true });
  
  function injectButton() {
    // Find container for the button
    const containers = document.querySelectorAll(platform.containerSelector);
    if (!containers || containers.length === 0) return;
    
    // Find the right container (the one with textarea)
    let targetContainer = null;
    for (const container of containers) {
      if (container.querySelector(platform.inputSelector)) {
        targetContainer = container;
        break;
      }
    }
    
    if (!targetContainer) return;
    
    // Check if button already exists
    if (document.getElementById('tokun-optimize-btn')) return;
    
    // Create and inject button
    const button = createOptimizeButton(platform);
    targetContainer.insertAdjacentElement(platform.buttonPosition, button);
  }
}

// Start the content script
initObserver();
