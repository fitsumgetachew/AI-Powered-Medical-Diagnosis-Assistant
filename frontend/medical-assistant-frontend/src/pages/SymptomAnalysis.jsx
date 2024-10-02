import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SymptomAnalysis.css';
import Sidebar from "../components/Sidebar.jsx";

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://34.66.93.187'
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const SymptomAnalysis = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUserInfo();
    fetchConversations();
  }, []);

  const fetchUserInfo = () => {
    const userInfoFromStorage = localStorage.getItem('userInfo');
    if (userInfoFromStorage) {
      try {
        const parsedUserInfo = JSON.parse(userInfoFromStorage);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
        localStorage.removeItem('userInfo');
      }
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await api.get('/symptom/list_conversations/');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      if (error.response && error.response.status === 401) {
        // Handle unauthorized error - maybe redirect to login
        console.log('User needs to log in');
      }
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const response = await api.get(`/symptom/conversation/${conversationId}/`);
      const conversation = response.data;
      setCurrentConversationId(conversationId);
      const messages = conversation.user_message.map((msg, index) => ({
        user: msg,
        ai: conversation.ai_response[index],
      }));
      setChatMessages(messages);
    } catch (error) {
      console.error('Error loading conversation:', error);
      if (error.response && error.response.status === 401) {
        console.log('User needs to log in');
      }
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    setChatMessages((prevMessages) => [...prevMessages, { user: userMessage, ai: '' }]);
    setUserMessage('');

    try {
      const response = await api.post('/symptom/chat/', {
        conversation_id: currentConversationId,
        user_message: userMessage,
      });
      const { ai_response, conversation } = response.data;
      setChatMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].ai = ai_response;
        return updatedMessages;
      });
      setCurrentConversationId(conversation.pk);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].ai = 'Error processing your message';
        return updatedMessages;
      });
      if (error.response && error.response.status === 401) {
        console.log('User needs to log in');
      }
    }
  };

  const analyzeConversation = async () => {
    setIsAnalyzing(true);
    try {
      const response = await api.post('/symptom/analysis/', {
        conversation_id: currentConversationId,
      });
      setAnalysisResult(response.data);
      setAnalysisVisible(true);
    } catch (error) {
      console.error('Error analyzing conversation:', error);
      alert('Error analyzing the conversation.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveToHistory = async () => {
    if (!analysisResult) return;

    setIsSaving(true);
    try {
      await api.post('/symptom/save-to-history/', {
        symptom_analysis_id: analysisResult.id
      });
      alert('Analysis saved to history successfully!');
    } catch (error) {
      console.error('Error saving to history:', error);
      alert('Error saving analysis to history.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="chat-container">
      {userInfo && <div className="user-info">Welcome, {userInfo.first_name}!</div>}
      <Sidebar
        conversations={conversations}
        loadConversation={loadConversation}
        currentConversationId={currentConversationId}
      />

      <div className="chat-area">
        <div className="chat-header">
          {currentConversationId && (
            <button
              onClick={analyzeConversation}
              className={`analyze-button ${isAnalyzing ? 'analyzing' : ''}`}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : 'Analyze Conversation'}
            </button>
          )}
        </div>

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

      {analysisVisible && analysisResult && (
        <div className="analysis-modal">
          <div className="analysis-content">
            <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>

            <div className="symptoms-list">
              <h3 className="text-lg font-medium mb-2">Identified Symptoms:</h3>
              <ul>
                {analysisResult.symptoms.map(symptom => (
                  <li key={symptom.id}>{symptom.name}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-text">
              <h3 className="text-lg font-medium mb-2">Analysis:</h3>
              <p>{analysisResult.analysis_result}</p>
            </div>

            <div className="analysis-actions">
              <button
                onClick={saveToHistory}
                className={`save-button ${isSaving ? 'saving' : ''}`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : 'Save to History'}
              </button>
              <button
                onClick={() => setAnalysisVisible(false)}
                className="close-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomAnalysis;