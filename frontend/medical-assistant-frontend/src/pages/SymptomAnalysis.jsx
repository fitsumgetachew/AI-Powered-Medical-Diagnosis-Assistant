import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SymptomAnalysis.css';
import Sidebar from "../components/Sidebar.jsx"; // Import the Sidebar component

const SymptomAnalysis = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // State to hold user information

  useEffect(() => {
    fetchUserInfo(); // Fetch user info on component mount
    fetchConversations(); // Fetch conversations on component mount
  }, []);

  const fetchUserInfo = () => {
  const userInfoFromStorage = localStorage.getItem('userInfo');
  if (userInfoFromStorage) {
    try {
      const parsedUserInfo = JSON.parse(userInfoFromStorage);
      setUserInfo(parsedUserInfo);
    } catch (error) {
      console.error('Error parsing user info:', error);
      // Optionally clear the bad data
      localStorage.removeItem('userInfo');
    }
  }
};

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/symptom/list_conversations/');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/symptom/conversation/${conversationId}/`);
      const conversation = response.data;
      setCurrentConversationId(conversationId);
      const messages = conversation.user_message.map((msg, index) => ({
        user: msg,
        ai: conversation.ai_response[index],
      }));
      setChatMessages(messages);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return; // Prevent sending empty messages
    setChatMessages((prevMessages) => [...prevMessages, { user: userMessage, ai: '' }]);
    setUserMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/symptom/chat/', {
        conversation_id: currentConversationId,
        user_message: userMessage,
      });
      const { ai_response, conversation } = response.data;
      setChatMessages((prevMessages) => [...prevMessages, { user: userMessage, ai: ai_response }]);
      setCurrentConversationId(conversation.pk);
      fetchConversations(); // Refresh conversations after sending a message
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages((prevMessages) => [...prevMessages, { user: userMessage, ai: 'Error processing your message' }]);
    }
  };

  const analyzeConversation = async () => {
    if (!currentConversationId) return alert('Please start or select a conversation before analyzing.');
    try {
      const response = await axios.post('http://127.0.0.1:8000/symptom/analysis/', {
        conversation_id: currentConversationId,
      });
      setAnalysisResult(response.data.analysis_result);
      setAnalysisVisible(true);
    } catch (error) {
      console.error('Error analyzing conversation:', error);
      alert('Error analyzing the conversation.');
    }
  };

  return (
    <div className="chat-container">
      {userInfo && <div className="user-info">Welcome, {userInfo.first_name}!</div>} {/* Display user info */}
      <Sidebar
        conversations={conversations}
        loadConversation={loadConversation}
        currentConversationId={currentConversationId}
      />

      <div className="chat-area">
        <div className="messages-area">
          {chatMessages.map((msg, index) => (
            <React.Fragment key={index}>
              <div className="message user-message">{msg.user}</div>
              {msg.ai && <div className="message ai-message">{msg.ai}</div>}
            </React.Fragment>
          ))}
        </div>

        <div className="chatbox-input">
          <input
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            type="text"
            className="input-box"
            placeholder="Type your symptoms here..."
          />
          <button onClick={sendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>

      {analysisVisible && (
        <div className="analysis-modal">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Conversation Analysis</h2>
            <p className="text-lg">{analysisResult}</p>
            <button
              onClick={() => setAnalysisVisible(false)}
              className="close-analysis"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomAnalysis;
