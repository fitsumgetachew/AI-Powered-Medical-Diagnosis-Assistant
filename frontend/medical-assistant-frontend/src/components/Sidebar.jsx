import React from 'react';
import './Sidebar.css'; // If you want a separate CSS file for the sidebar

const Sidebar = ({ conversations, loadConversation, currentConversationId }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-handle"></div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Conversation History</h2>
        <ul className="space-y-2">
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
