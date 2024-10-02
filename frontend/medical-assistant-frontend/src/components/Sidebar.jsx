import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ conversations, loadConversation, currentConversationId }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button
        className="collapse-btn"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? '→' : '←'}
      </button>

      <div className="sidebar-content">
        <a href="/symptom-analysis" className="new-conversation-btn">
          + New Conversation
        </a>

        <h2 className="sidebar-title">Conversation History</h2>
        <ul className="conversation-list">
          {conversations.map((conv) => (
            <li
              key={conv.pk}
              onClick={() => loadConversation(conv.pk)}
              className={conv.pk === currentConversationId ? 'active' : ''}
            >
              {conv.name || `Conversation ${conv.pk}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;