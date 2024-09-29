let currentConversationId = null;

async function fetchConversations() {
    try {
        const response = await axios.get('http://127.0.0.1:8000/symptom/list_conversations/');
        const conversations = response.data;
        const conversationList = document.getElementById('conversationList');
        conversationList.innerHTML = '';
        conversations.forEach(conv => {
            const li = document.createElement('li');
            li.textContent = conv.name || `Conversation ${conv.pk}`;
            li.dataset.conversationId = conv.pk;
            li.onclick = () => loadConversation(conv.pk);
            if (conv.pk === currentConversationId) {
                li.classList.add('active');
            }
            conversationList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
    }
}

async function loadConversation(conversationId) {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/symptom/conversation/${conversationId}/`);
        const conversation = response.data;
        currentConversationId = conversationId;
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.innerHTML = '';
        conversation.user_message.forEach((msg, index) => {
            appendMessage(msg, 'user', false);
            if (conversation.ai_response[index]) {
                appendMessage(conversation.ai_response[index], 'ai', false);
            }
        });
        document.getElementById('analyzeButton').classList.remove('hidden');

        // Update the active conversation in the sidebar
        const conversationItems = document.querySelectorAll('#conversationList li');
        conversationItems.forEach(item => {
            if (item.dataset.conversationId == conversationId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    } catch (error) {
        console.error('Error loading conversation:', error);
    }
}

function appendMessage(message, sender, animate = false) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    if (animate) {
        messageDiv.classList.add('type-writer');
    }
    messageDiv.textContent = message;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (message) {
        appendMessage(message, 'user', false);
        userInput.value = '';

        try {
            const response = await axios.post('http://127.0.0.1:8000/symptom/chat/', {
                conversation_id: currentConversationId,
                user_message: message
            });
            const aiResponse = response.data.ai_response;
            appendMessage(aiResponse, 'ai', true);
            currentConversationId = response.data.conversation.pk;
            fetchConversations();
            document.getElementById('analyzeButton').classList.remove('hidden');
        } catch (error) {
            console.error('Error sending message:', error);
            appendMessage('Sorry, there was an error processing your message.', 'ai', false);
        }
    }
}

async function analyzeConversation() {
    if (currentConversationId) {
        try {
            const response = await axios.post('http://127.0.0.1:8000/symptom/analysis/', {
                conversation_id: currentConversationId
            });
            const analysisResult = response.data.analysis_result;
            document.getElementById('analysisContent').textContent = analysisResult;
            document.getElementById('analysisModal').style.display = 'block';
        } catch (error) {
            console.error('Error analyzing conversation:', error);
            alert('There was an error analyzing the conversation.');
        }
    } else {
        alert('Please start or select a conversation before analyzing.');
    }
}

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
document.getElementById('analyzeButton').addEventListener('click', analyzeConversation);
document.getElementById('closeAnalysis').addEventListener('click', function() {
    document.getElementById('analysisModal').style.display = 'none';
});

fetchConversations();