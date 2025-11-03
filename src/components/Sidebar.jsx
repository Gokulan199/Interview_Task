import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ onNewQuestion, onSelectFolder, selectedFolder, questions }) {
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showFolder1Dropdown, setShowFolder1Dropdown] = useState(false);
  const [showFolder2Dropdown, setShowFolder2Dropdown] = useState(false);

  const questionTypeCounts = {
    SAQ: questions.filter(q => q.type === 'SAQ').length,
    MAQ: questions.filter(q => q.type === 'MAQ').length,
    Numerical: questions.filter(q => q.type === 'Numerical').length,
    'True/False': questions.filter(q => q.type === 'True/False').length,
    Descriptive: questions.filter(q => q.type === 'Descriptive').length
  };

  const uncategorizedCount = questions.filter(q => !q.folder).length;

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header-section">
          <div className="section-label">QUESTIONS</div>
        </div>

        <div className="new-question-section">
          <button 
            className="btn-new-question" 
            onClick={() => setShowQuestionTypes(!showQuestionTypes)}
          >
            New Question
          </button>
          {showQuestionTypes && (
            <div className="question-types-dropdown">
              <div onClick={() => { onNewQuestion('SAQ'); setShowQuestionTypes(false); }}>SAQ</div>
              <div onClick={() => { onNewQuestion('MAQ'); setShowQuestionTypes(false); }}>MAQ</div>
              <div onClick={() => { onNewQuestion('Numerical'); setShowQuestionTypes(false); }}>Numerical</div>
              <div onClick={() => { onNewQuestion('True/False'); setShowQuestionTypes(false); }}>True/False</div>
              <div onClick={() => { onNewQuestion('Descriptive'); setShowQuestionTypes(false); }}>Descriptive</div>
            </div>
          )}
        </div>

        <div className="sidebar-section">
          <div className="sidebar-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            <span>Trashed</span>
          </div>
        </div>

        <hr className="sidebar-divider" />

        <div className="sidebar-section">
          <div className="section-header">QUESTION TYPES</div>
          <div className="sidebar-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
            <span>SAQ ({questionTypeCounts.SAQ})</span>
          </div>
          <div className="sidebar-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
            <span>MAQ ({questionTypeCounts.MAQ})</span>
          </div>
          <div className="sidebar-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H9v-2h3V7h2v4h3v2h-3v4z"/>
            </svg>
            <span>Numerical ({questionTypeCounts.Numerical})</span>
          </div>
          <div className="sidebar-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>True/False ({questionTypeCounts['True/False']})</span>
          </div>
          <div className="sidebar-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <span>Descriptive ({questionTypeCounts.Descriptive})</span>
          </div>
        </div>

        <hr className="sidebar-divider" />

        <div className="sidebar-section">
          <div className="section-header">CATEGORIES</div>
          <div className="sidebar-item">
            <span className="add-icon">+</span>
            <span>New Category</span>
          </div>
          <div className="sidebar-item-with-dropdown">
            <div 
              className={`sidebar-item ${selectedFolder === 'Folder 1' ? 'active' : ''}`}
              onClick={() => onSelectFolder(selectedFolder === 'Folder 1' ? null : 'Folder 1')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L19 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1.37z"/>
              </svg>
              <span>Folder 1 (10)</span>
            </div>
            <button 
              className="dropdown-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setShowFolder1Dropdown(!showFolder1Dropdown);
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {showFolder1Dropdown && (
              <div className="folder-dropdown">
                <div>Edit</div>
                <div>Remove</div>
              </div>
            )}
          </div>
          <div className="sidebar-item-with-dropdown">
            <div 
              className={`sidebar-item ${selectedFolder === 'Folder 2' ? 'active' : ''}`}
              onClick={() => onSelectFolder(selectedFolder === 'Folder 2' ? null : 'Folder 2')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#00C853">
                <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L19 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-1.37z"/>
              </svg>
              <span>Folder 2 (20)</span>
            </div>
            <button 
              className="dropdown-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setShowFolder2Dropdown(!showFolder2Dropdown);
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {showFolder2Dropdown && (
              <div className="folder-dropdown">
                <div>Edit</div>
                <div>Remove</div>
              </div>
            )}
          </div>
          <div 
            className={`sidebar-item ${selectedFolder === null ? 'active' : ''}`}
            onClick={() => onSelectFolder(null)}
          >
            <span className="uncategorized-label">Uncategorized ({uncategorizedCount})</span>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <hr className="sidebar-divider" />
        <div className="sidebar-item-with-dropdown">
          <div className="sidebar-item" onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
            <span>Settings</span>
          </div>
          <button 
            className="dropdown-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setShowSettingsDropdown(!showSettingsDropdown);
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
          {showSettingsDropdown && (
            <div className="settings-dropdown">
              <div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                <span>Edit</span>
              </div>
              <div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                <span>Download</span>
              </div>
              <div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                </svg>
                <span>Add to Folder</span>
              </div>
              <div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/>
                </svg>
                <span>Archived</span>
              </div>
              <div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                <span>Trashed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
