import { useState } from 'react';
import QuestionCard from './QuestionCard';
import './QuestionList.css';

function QuestionList({ questions, onEdit, onCopy, onDelete, onRemoveFolder, searchTerm, onSearchChange }) {
  const [displayCount, setDisplayCount] = useState(5);
  const [fullView, setFullView] = useState(false);

  const displayedQuestions = questions.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 4, questions.length));
  };

  return (
    <main className="question-list-container">
      <div className="question-list-header">
        <div className="title-section">
          <h1>QB 1 Questions</h1>
          <button className="icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </button>
          <button className="icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
          </button>
        </div>
        <div className="search-section">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="questions-container">
        {displayedQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onEdit={onEdit}
            onCopy={onCopy}
            onDelete={onDelete}
            onRemoveFolder={onRemoveFolder}
            fullView={fullView}
          />
        ))}
      </div>

      <div className="pagination-section">
        {displayCount < questions.length && (
          <button className="btn-outlined" onClick={handleLoadMore}>
            Load More
          </button>
        )}
        <button className="btn-outlined" onClick={() => setFullView(!fullView)}>
          {fullView ? 'Compact View' : 'Full View'}
        </button>
        <p className="pagination-info">
          Showing 1 to {Math.min(displayCount, questions.length)} of {questions.length} questions
        </p>
      </div>
    </main>
  );
}

export default QuestionList;
