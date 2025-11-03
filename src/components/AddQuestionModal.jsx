import { useState, useEffect } from 'react';
import './AddQuestionModal.css';

function AddQuestionModal({ type, onClose, onSave, editingQuestion }) {
  const [questionData, setQuestionData] = useState({
    type: type,
    section: '',
    marks: '',
    folder: '',
    questionText: '',
    options: [''],
    correctAnswer: '',
    solution: '',
    images: {}
  });

  useEffect(() => {
    if (editingQuestion) {
      setQuestionData(editingQuestion);
    }
  }, [editingQuestion]);

  const handleInputChange = (field, value) => {
    setQuestionData({ ...questionData, [field]: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const handleAddOption = () => {
    setQuestionData({ ...questionData, options: [...questionData.options, ''] });
  };

  const handleRemoveOption = (index) => {
    const newOptions = questionData.options.filter((_, i) => i !== index);
    setQuestionData({ ...questionData, options: newOptions });
  };

  const handleSave = () => {
    if (!questionData.questionText.trim()) {
      alert('Please enter a question');
      return;
    }
    onSave(questionData);
  };

  const getModalTitle = () => {
    const typeMap = {
      'SAQ': 'SAQ',
      'MAQ': 'MAQ',
      'Numerical': 'Numerical',
      'True/False': 'True/False',
      'Descriptive': 'Descriptive'
    };
    return `Add ${typeMap[type]} Question`;
  };

  const showOptions = type === 'SAQ' || type === 'MAQ' || type === 'True/False';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getModalTitle()}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="modal-left">
            <div className="form-group">
              <label>Question</label>
              <div className="toolbar">
                <button type="button" className="toolbar-btn"><strong>B</strong></button>
                <button type="button" className="toolbar-btn"><em>I</em></button>
                <button type="button" className="toolbar-btn">•</button>
                <button type="button" className="toolbar-btn">1.</button>
                <button type="button" className="toolbar-btn">↶</button>
                <button type="button" className="toolbar-btn">↷</button>
                <button type="button" className="toolbar-btn">&lt;/&gt;</button>
              </div>
              <textarea
                placeholder="Enter the question text..."
                value={questionData.questionText}
                onChange={(e) => handleInputChange('questionText', e.target.value)}
                rows="5"
              />
            </div>

            <div className="form-group">
              <label>Upload Images</label>
              <input type="file" accept="image/*" />
            </div>

            <div className="form-group">
              <label>Section</label>
              <input
                type="text"
                placeholder="Enter section..."
                value={questionData.section}
                onChange={(e) => handleInputChange('section', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Marks</label>
              <input
                type="text"
                placeholder="Enter marks..."
                value={questionData.marks}
                onChange={(e) => handleInputChange('marks', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Folder</label>
              <select
                value={questionData.folder}
                onChange={(e) => handleInputChange('folder', e.target.value)}
              >
                <option value="">Select folder...</option>
                <option value="Folder 1">Folder 1</option>
                <option value="Folder 2">Folder 2</option>
              </select>
            </div>

            {showOptions && (
              <>
                <div className="form-group">
                  <label>Options</label>
                  {questionData.options.map((option, index) => (
                    <div key={index} className="option-input-group">
                      <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                      {questionData.options.length > 1 && (
                        <button 
                          type="button"
                          className="remove-option-btn"
                          onClick={() => handleRemoveOption(index)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    className="btn-add-option" 
                    onClick={handleAddOption}
                  >
                    + Add Option
                  </button>
                </div>

                <div className="form-group">
                  <label>Correct Answer(s)</label>
                  <select
                    value={questionData.correctAnswer}
                    onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
                  >
                    <option value="">Select correct Option(s)...</option>
                    {questionData.options.map((option, index) => (
                      option && <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {type === 'Numerical' && (
              <div className="form-group">
                <label>Correct Answer</label>
                <input
                  type="text"
                  placeholder="Enter numerical answer..."
                  value={questionData.correctAnswer}
                  onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Solution</label>
              <textarea
                placeholder="Enter solution text..."
                value={questionData.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                rows="4"
              />
            </div>
          </div>

          <div className="modal-right">
            <h3>Live Preview</h3>
            <div className="preview-content">
              <div className="preview-section">
                <strong>Question</strong>
                <p>{questionData.questionText || 'No question entered yet'}</p>
              </div>

              {showOptions && questionData.options.some(opt => opt) && (
                <div className="preview-section">
                  <strong>Options:</strong>
                  <ul>
                    {questionData.options.filter(opt => opt).map((option, index) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="preview-section">
                <strong>Solution:</strong>
                <p>{questionData.solution || 'No solution provided'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default AddQuestionModal;
