// Initialize chat elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');

// Your Gemini API key - In production, this should be secured
const API_KEY = 'AIzaSyA4odgQl1YyCHqYd7UaKTDXS-G_6hsY3iI';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Context for the pharmacy chatbot
const PHARMACY_CONTEXT = `You are a helpful pharmacy assistant. You can help with:
- Medication information and availability
- Delivery timing and tracking
- General health advice
- Prescription refills
- Store locations and hours
Always be professional and remind users to consult healthcare professionals for medical advice.`;

// Add message to chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    indicator.id = 'typing-indicator';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Process user message and get AI response
async function processMessage(userMessage) {
    try {
        showTypingIndicator();
        
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${PHARMACY_CONTEXT}\n\nUser: ${userMessage}\nAssistant:`
                    }]
                }]
            })
        });

        const data = await response.json();
        hideTypingIndicator();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            addMessage(data.candidates[0].content.parts[0].text);
        } else {
            addMessage("I apologize, but I'm having trouble processing your request. Please try again.");
        }
    } catch (error) {
        hideTypingIndicator();
        addMessage("I apologize, but I'm having trouble connecting. Please check your internet connection and try again.");
        console.error('Error:', error);
    }
}

// Handle user input
function handleUserInput() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        processMessage(message);
    }
}

// Event listeners
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Initial focus
userInput.focus();