import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import QuestionList from './components/QuestionList';
import AddQuestionModal from './components/AddQuestionModal';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    const storedQuestions = localStorage.getItem('lmsQuestions');
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      const initialQuestions = [
        {
          id: 1,
          type: 'SAQ',
          section: 'Trigonometry',
          marks: 3,
          folder: 'Folder 1',
          questionText: 'Identify the graph of the function $$y = \\sin(x)$$ from the options below:',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option A',
          solution: 'The sine function has a periodic wave pattern...',
          images: {}
        },
        {
          id: 2,
          type: 'SAQ',
          section: 'Advanced Mathematics',
          marks: 10,
          folder: 'Folder 1',
          questionText: 'A particle moves along a path defined by: $$x(t) = R \\cos(\\omega t), \\quad y(t) = R \\sin(\\omega t), \\quad z(t) = kt^2$$ Which...',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option B',
          solution: 'The path describes a helical motion...',
          images: {}
        },
        {
          id: 3,
          type: 'Descriptive',
          section: 'Table',
          marks: 'N/A',
          folder: 'Folder 2',
          questionText: 'The following table shows experimental data for a reaction: Time (s) Concentration (M) 0 1.00 10 0.82 Determine the reac...',
          options: [],
          correctAnswer: '',
          solution: 'Using the rate equation...',
          images: {}
        },
        {
          id: 4,
          type: 'Numerical',
          section: 'Thermodynamics',
          marks: 5,
          folder: 'Folder 1',
          questionText: 'Calculate the root mean square speed of oxygen molecules (O₂) at 300 K. Molar mass = 32 g/mol, R = 8.314 J/(mol·K).',
          options: [],
          correctAnswer: '483.6',
          solution: 'Using the formula v_rms = √(3RT/M)...',
          images: {}
        },
        {
          id: 5,
          type: 'True/False',
          section: 'Geometry',
          marks: 2,
          folder: 'Folder 2',
          questionText: 'The Pythagorean theorem states $$c^2 = a^2 + b^2$$ for right triangles. true false',
          options: ['True', 'False'],
          correctAnswer: 'True',
          solution: 'This is the standard form of the Pythagorean theorem.',
          images: {}
        }
      ];
      setQuestions(initialQuestions);
      localStorage.setItem('lmsQuestions', JSON.stringify(initialQuestions));
    }
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem('lmsQuestions', JSON.stringify(questions));
    }
  }, [questions]);

  const handleNewQuestion = (type) => {
    setModalType(type);
    setEditingQuestion(null);
    setShowModal(true);
  };

  const handleSaveQuestion = (questionData) => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? { ...questionData, id: editingQuestion.id } : q));
    } else {
      const newQuestion = {
        ...questionData,
        id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1
      };
      setQuestions([...questions, newQuestion]);
    }
    setShowModal(false);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setModalType(question.type);
    setShowModal(true);
  };

  const handleCopyQuestion = (question) => {
    const newQuestion = {
      ...question,
      id: Math.max(...questions.map(q => q.id)) + 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleRemoveFolder = (id) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, folder: null } : q));
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.section.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = !selectedFolder || q.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <Sidebar 
          onNewQuestion={handleNewQuestion}
          onSelectFolder={setSelectedFolder}
          selectedFolder={selectedFolder}
          questions={questions}
        />
        <QuestionList 
          questions={filteredQuestions}
          onEdit={handleEditQuestion}
          onCopy={handleCopyQuestion}
          onDelete={handleDeleteQuestion}
          onRemoveFolder={handleRemoveFolder}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
      {showModal && (
        <AddQuestionModal 
          type={modalType}
          onClose={() => setShowModal(false)}
          onSave={handleSaveQuestion}
          editingQuestion={editingQuestion}
        />
      )}
    </div>
  );
}

export default App;
