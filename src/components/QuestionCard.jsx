import { useState } from 'react';
import './QuestionCard.css';

function QuestionCard({ question, onEdit, onCopy, onDelete, onRemoveFolder, fullView }) {
  const [showSolution, setShowSolution] = useState(false);

  const getTypeLabel = (type) => {
    const typeMap = {
      'SAQ': 'Single Answer',
      'MAQ': 'Multiple Answer',
      'Numerical': 'Numerical Answer',
      'True/False': 'True or False',
      'Descriptive': 'Descriptive'
    };
    return typeMap[type] || type;
  };

  const getFolderColor = (folder) => {
    return folder === 'Folder 1' ? 'red' : 'green';
  };

  const truncateText = (text, maxLength = 100) => {
    if (fullView) return text;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="question-card">
      <div className="question-card-header">
        <input type="checkbox" className="question-checkbox" />
        <span className="question-id">QId: {question.id}</span>
        <span className="question-badge type-badge">Type: {getTypeLabel(question.type)}</span>
        <span className="question-badge section-badge">Section: {question.section}</span>
        <span className="question-badge marks-badge">Marks: {question.marks}</span>
        {question.folder && (
          <span className="folder-tag">
            <span className={`folder-dot ${getFolderColor(question.folder)}`}></span>
            {question.folder}
            <button 
              className="remove-folder-btn"
              onClick={() => onRemoveFolder(question.id)}
            >
              ×
            </button>
          </span>
        )}
      </div>
      <div className="question-content">
        <p className="question-text">{truncateText(question.questionText)}</p>
        
        {fullView && question.options && question.options.length > 0 && (
          <div className="question-options">
            <strong>Options:</strong>
            <ul>
              {question.options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </div>
        )}

        {fullView && (
          <div className="question-solution-section">
            <button 
              className="solution-toggle"
              onClick={() => setShowSolution(!showSolution)}
            >
              Solution {showSolution ? '▲' : '▼'}
            </button>
            {showSolution && (
              <div className="solution-content">
                {question.solution || 'No solution provided'}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="question-actions">
        <button className="action-btn copy-btn" onClick={() => onCopy(question)} title="Copy">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>
        <button className="action-btn edit-btn" onClick={() => onEdit(question)} title="Edit">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button className="action-btn share-btn" onClick={() => {}} title="Share">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z"/>
          </svg>
        </button>
        <button className="action-btn archive-btn" onClick={() => {}} title="Archive">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </button>
        <button className="action-btn delete-btn" onClick={() => onDelete(question.id)} title="Delete">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default QuestionCard;
