import React, { useEffect, useState, useRef } from "react";
import "./App.css"; // keep your styles

// lucide icons
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users,
  GraduationCap,
  UserCircle,
  PlusCircle,
  Trash2,
  Type,
  Calculator,
  AlignLeft,
  CheckSquare,
  Folder,
  ChevronDown,
  Copy,
  Edit2,
} from "lucide-react";

/* --------------------------
   storage keys & helpers
   -------------------------- */
const STORAGE_KEY = "questions_v1";
const NEXT_ID_KEY = "questions_v1_nextId";

function loadQuestions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQuestions(qs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(qs));
}

function getNextId() {
  const raw = localStorage.getItem(NEXT_ID_KEY);
  if (!raw) {
    localStorage.setItem(NEXT_ID_KEY, "3"); // reserve 1 & 2 for seed
    return 3;
  }
  const id = parseInt(raw, 10);
  localStorage.setItem(NEXT_ID_KEY, String(id + 1));
  return id;
}

/* --------------------------
   App component
   -------------------------- */
export default function App() {
  const [questions, setQuestions] = useState(loadQuestions());
  const [view, setView] = useState({ type: "list", filter: "all" }); // list | trash
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [fullView, setFullView] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [categories, setCategories] = useState(["Uncategorized", "folder 1", "folder 2", "New category"]);
  const [showDropdown, setShowDropdown] = useState(false);
  const nextIdRef = useRef(null);
  const [searchText, setSearchText] = useState("");

  // initialize nextIdRef on mount
  useEffect(() => {
    const raw = localStorage.getItem(NEXT_ID_KEY);
    if (!raw) {
      localStorage.setItem(NEXT_ID_KEY, "3");
      nextIdRef.current = 3;
    } else {
      nextIdRef.current = parseInt(raw, 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist questions
  useEffect(() => saveQuestions(questions), [questions]);

  // initial seed if empty (only first run)
  useEffect(() => {
    if (!questions || questions.length === 0) {
      const seed = [
        {
          id: 1,
          type: "SAQ",
          category: "Uncategorized",
          title: "What is the capital of India?",
          options: [],
          solution: "New Delhi",
          trashed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          type: "True/False",
          category: "folder 1",
          title: "The earth is flat.",
          options: [{ id: 1, text: "True", correct: false }, { id: 2, text: "False", correct: true }],
          solution: "False",
          trashed: false,
          createdAt: new Date().toISOString(),
        },
      ];
      setQuestions(seed);
      // ensure NEXT_ID_KEY is set to 3
      localStorage.setItem(NEXT_ID_KEY, "3");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add or update
  function upsertQuestion(payload) {
    if (payload.id) {
      setQuestions(prev => prev.map(q => (q.id === payload.id ? { ...q, ...payload } : q)));
    } else {
      const id = getNextId();
      const q = { ...payload, id, createdAt: new Date().toISOString(), trashed: false };
      setQuestions(prev => [q, ...prev]);
    }
    setModalOpen(false);
    setEditing(null);
    setShowDropdown(false);
  }

  // copy a question (creates new question with new id)
  function handleCopy(id) {
    const q = questions.find(x => x.id === id);
    if (!q) return;
    const copy = {
      ...q,
      id: getNextId(),
      title: `${q.title} (copy)`,
      createdAt: new Date().toISOString(),
      trashed: false,
    };
    setQuestions(prev => [copy, ...prev]);
  }

  // toggle trash / restore
  function handleDeleteToggle(id) {
    setQuestions(prev => prev.map(q => (q.id === id ? { ...q, trashed: !q.trashed } : q)));
  }

  // edit -> open modal with question
  function handleEdit(id) {
    const q = questions.find(x => x.id === id);
    if (!q) return;
    setEditing(q);
    setModalOpen(true);
    setShowDropdown(false);
  }

  // filtered list according to view.filter
  const filtered = questions
    .filter(q => {
      if (view.filter === "trash") return q.trashed;
      if (q.trashed) return false;
      if (searchText && !q.title.toLowerCase().includes(searchText.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first

  // visible slice based on visibleCount
  const visible = filtered.slice(0, visibleCount);

  function loadMore() {
    setVisibleCount(prev => prev + 4);
  }

  return (
    <div className="app">
      <Topbar onAdminClick={() => {}} />
      <div className="main" style={{ display: "flex", gap: 12 }}>
        <Sidebar
          categories={categories}
          onNew={() => setShowDropdown(s => !s)}
          showDropdown={showDropdown}
          onTypeSelect={(t) => {
            // when user clicks type from dropdown, open modal with that type
            setEditing({ type: t });
            setModalOpen(true);
            setShowDropdown(false);
          }}
          onSelect={(cat) => {
            setView({ type: "list", filter: "all" });
            // category filter could be implemented here if desired
          }}
          onShowTrash={() => setView({ type: "list", filter: "trash" })}
        />
        <div className="content" style={{ flex: 1 }}>
          <div className="content-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>Question Bank</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                placeholder="Search..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd" }}
              />
              <button onClick={() => { setVisibleCount(4); }}>Reset View</button>
            </div>
          </div>

          <QuestionList
            questions={visible}
            onCopy={handleCopy}
            onEdit={handleEdit}
            onDeleteToggle={handleDeleteToggle}
            onOpenFull={q => setFullView(q)}
          />

          <div className="controls" style={{ marginTop: 12 }}>
            {visibleCount < filtered.length && <button onClick={loadMore}>Load more</button>}
            {filtered.length === 0 && <div>No questions found.</div>}
            <div style={{ marginTop: 8, color: "#666" }}>Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} questions</div>
          </div>
        </div>
      </div>

      {/* Question modal */}
      {modalOpen && (
        <QuestionModal
          categories={categories}
          initial={editing && editing.id ? editing : undefined}
          selectedType={(editing && !editing.id && editing.type) ? editing.type : undefined}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSave={upsertQuestion}
          onAddCategory={name => setCategories(prev => [name, ...prev])}
        />
      )}

      {fullView && (
        <FullViewModal q={fullView} onClose={() => setFullView(null)} />
      )}
    </div>
  );
}

/* --- Topbar --- */
function Topbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "tests", label: "Tests", icon: <ClipboardList size={18} /> },
    { key: "banks", label: "Question Banks", icon: <BookOpen size={18} /> },
    { key: "classes", label: "Classes", icon: <GraduationCap size={18} /> },
    { key: "teachers", label: "Teachers", icon: <Users size={18} /> },
  ];

  return (
    <div className="topbar" style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#fff", borderBottom: "1px solid #eee" }}>
      <div className="left" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <BookOpen size={20} />
        <span className="label" style={{ fontWeight: 700 }}>LMS Admin</span>
      </div>

      <div className="center" style={{ flex: 1, textAlign: "center" }}>
        <nav style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
          {navItems.map((item, idx) => (
            <span key={item.key} className="nav-item" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {item.icon}
              <span>{item.label}</span>
              {idx < navItems.length - 1 && <span style={{ margin: "0 6px", color: "#ccc" }}>·</span>}
            </span>
          ))}
        </nav>
      </div>

      <div className="right" style={{ display: "inline-flex", alignItems: "center", gap: 8, position: "relative" }}>
        <div className="admin" onClick={() => setOpen(s => !s)} style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", gap: 8 }}>
          <UserCircle size={18} />
          <span>Admin ▾</span>
        </div>

        {open && (
          <div className="admin-popup" style={{ position: "absolute", right: 12, top: 56, background: "#fff", border: "1px solid #ddd", padding: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.08)", borderRadius: 6 }}>
            <div style={{ padding: "6px 10px", cursor: "pointer" }}>My profile</div>
            <div style={{ padding: "6px 10px", cursor: "pointer" }}>Account settings</div>
            <div style={{ padding: "6px 10px", cursor: "pointer" }}>Dashboard</div>
            <div style={{ padding: "6px 10px", cursor: "pointer" }}>My courses</div>
            <hr />
            <div style={{ padding: "6px 10px", cursor: "pointer" }}>Help center</div>
            <div style={{ padding: "6px 10px", cursor: "pointer" }}>Logout</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Sidebar (scrollable + HR between categories & settings) --- */
function Sidebar({ categories, onNew, showDropdown, onTypeSelect, onSelect, onShowTrash }) {
  const [openCat, setOpenCat] = useState(false);

  const questionTypes = [
    { label: "SAQ", icon: <Type size={14} /> },
    { label: "MAQ", icon: <CheckSquare size={14} /> },
    { label: "Numerical", icon: <Calculator size={14} /> },
    { label: "True/False", icon: <AlignLeft size={14} /> },
    { label: "Descriptive", icon: <FileText size={14} /> },
  ];

  return (
    <aside className="sidebar" style={{ width: 260, background: "#f8f9fa", borderRight: "1px solid #eee", padding: 12, height: "calc(100vh - 72px)", overflowY: "auto" }}>
      <div style={{ position: "relative" }}>
        <button
          className="new-btn"
          onClick={onNew}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 12px", background: "#0b74ff", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", width: "100%" }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PlusCircle size={16} /> New Question
          </span>
          <ChevronDown size={16} />
        </button>

        {showDropdown && (
          <div style={{ position: "absolute", top: 52, left: 0, width: "100%", background: "#fff", border: "1px solid #ddd", borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.08)", zIndex: 40 }}>
            {questionTypes.map(qt => (
              <div
                key={qt.label}
                onClick={() => onTypeSelect(qt.label)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f6f7f9"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {qt.icon}
                <div style={{ fontWeight: 600 }}>{qt.label}</div>
                <div style={{ marginLeft: "auto", color: "#666", fontSize: 13 }}>Add</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr style={{ margin: "12px 0" }} />

      <div onClick={onSelect} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <FileText size={16} /> Questions
      </div>

      <div onClick={onShowTrash} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 8 }}>
        <Trash2 size={16} /> Trashed
      </div>

      <hr style={{ margin: "12px 0" }} />

      <div style={{ fontWeight: 700 }}>QUESTION TYPES</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        <div><Type size={14} /> SAQ</div>
        <div><CheckSquare size={14} /> MAQ</div>
        <div><Calculator size={14} /> Numerical</div>
        <div><AlignLeft size={14} /> True/False</div>
        <div><FileText size={14} /> Descriptive</div>
      </div>

      <hr style={{ margin: "12px 0" }} />

      <div>
        <div onClick={() => setOpenCat(s => !s)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 700 }}>
          <Folder size={14} /> CATEGORIES ▾
        </div>

        {openCat && (
          <div style={{ marginLeft: 14, marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {categories.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Folder size={12} /> {c}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HR between categories and settings (requested) */}
      <hr style={{ margin: "12px 0" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <FileText size={16} /> <span>Settings</span>
      </div>
    </aside>
  );
}

/* --------------------------
   Question List Table
   -------------------------- */
function QuestionList({ questions, onCopy, onEdit, onDeleteToggle, onOpenFull }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: "1px solid #eee" }}>Qn Id</th>
            <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: "1px solid #eee" }}>Type</th>
            <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: "1px solid #eee" }}>Category</th>
            <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: "1px solid #eee" }}>Title</th>
            <th style={{ textAlign: "left", padding: "8px 6px", borderBottom: "1px solid #eee" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(q => (
            <tr key={q.id}>
              <td style={{ padding: "8px 6px", verticalAlign: "top" }}>{q.id}</td>
              <td style={{ padding: "8px 6px", verticalAlign: "top" }}>{q.type}</td>
              <td style={{ padding: "8px 6px", verticalAlign: "top" }}>{q.category}</td>
              <td style={{ padding: "8px 6px", verticalAlign: "top" }}>
                <button className="link" onClick={() => onOpenFull(q)} style={{ background: "none", border: "none", padding: 0, color: "#0b74ff", cursor: "pointer" }}>{q.title}</button>
              </td>
              <td style={{ padding: "8px 6px", verticalAlign: "top" }}>
                <button title="Copy" onClick={() => onCopy(q.id)} style={{ marginRight: 8 }}><Copy size={14} /></button>
                <button title="Edit" onClick={() => onEdit(q.id)} style={{ marginRight: 8 }}><Edit2 size={14} /></button>
                <button title={q.trashed ? "Restore" : "Trash"} onClick={() => onDeleteToggle(q.id)}>{q.trashed ? "Restore" : "Trash"}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------
   Full View Modal
   -------------------------- */
function FullViewModal({ q, onClose }) {
  const [showSol, setShowSol] = useState(false);
  return (
    <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 200 }}>
      <div className="modal" style={{ width: "80%", maxWidth: 900, background: "#fff", borderRadius: 8, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Q#{q.id} - {q.type}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20 }}>✕</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <p><strong>Category:</strong> {q.category}</p>
          <div className="question-display" style={{ background: "#fafafa", padding: 12, borderRadius: 6 }}>{q.title}</div>
        </div>

        {!showSol ? (
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setShowSol(true)} style={{ padding: "8px 12px", borderRadius: 6, background: "#0b74ff", color: "#fff", border: "none" }}>Show solution</button>
          </div>
        ) : (
          <div className="solution" style={{ marginTop: 12, background: "#fff4e5", padding: 12, borderRadius: 6 }}>
            <strong>Solution:</strong>
            <div style={{ marginTop: 8 }}>{q.solution || "No solution provided."}</div>
          </div>
        )}

        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button onClick={onClose} style={{ padding: "8px 12px", borderRadius: 6 }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------
   QuestionModal (detailed)
   -------------------------- */
function QuestionModal({ initial, categories, selectedType, onClose, onSave, onAddCategory }) {
  const effectiveType = (initial && initial.type) || selectedType || "SAQ";

  const [type, setType] = useState(effectiveType);
  const [category, setCategory] = useState((initial && initial.category) || (categories && categories[0]) || "Uncategorized");
  const [title, setTitle] = useState((initial && initial.title) || "");
  const [titleImage, setTitleImage] = useState((initial && initial.titleImage) || null);

  const [options, setOptions] = useState(() => {
    if (initial && initial.options) return initial.options;
    if (effectiveType === "True/False") return [{ id: 1, text: "True", correct: true }, { id: 2, text: "False", correct: false }];
    return [{ id: 1, text: "", correct: false }];
  });

  const [numericAnswer, setNumericAnswer] = useState((initial && initial.numericAnswer) || "");
  const [solution, setSolution] = useState((initial && initial.solution) || "");
  const [solutionImage, setSolutionImage] = useState((initial && initial.solutionImage) || null);

  useEffect(() => {
    setType(effectiveType);
    if (!initial) {
      if (effectiveType === "True/False") {
        setOptions([{ id: 1, text: "True", correct: true }, { id: 2, text: "False", correct: false }]);
      } else {
        setOptions([{ id: 1, text: "", correct: false }]);
      }
      setTitle("");
      setTitleImage(null);
      setNumericAnswer("");
      setSolution("");
      setSolutionImage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  function addOption() {
    setOptions(prev => [...prev, { id: Date.now(), text: "", correct: false }]);
  }

  function updateOption(id, patch) {
    setOptions(prev => prev.map(o => (o.id === id ? { ...o, ...patch } : o)));
  }

  function removeOption(id) {
    setOptions(prev => prev.filter(o => o.id !== id));
  }

  function onUploadImage(fileSetter, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => fileSetter(reader.result);
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    const payload = {
      id: initial && initial.id ? initial.id : undefined,
      type,
      category,
      title,
      titleImage,
      options: (type === "SAQ" || type === "MAQ" || type === "True/False") ? options : undefined,
      numericAnswer: type === "Numerical" ? numericAnswer : undefined,
      solution,
      solutionImage
    };
    if (onSave) onSave(payload);
  }

  return (
    <div className="modal-backdrop" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 200 }}>
      <div className="modal large" style={{ display: "flex", gap: 16, width: "92%", maxWidth: 1100, background: "#fff", borderRadius: 8, padding: 12 }}>
        {/* left: form */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>{initial ? `Edit ${type} Question` : `Add ${type} Question`}</h3>
            <button aria-label="Close" onClick={onClose} style={{ fontSize: 18, background: "none", border: "none", cursor: "pointer" }}>✕</button>
          </div>

          <form onSubmit={submit}>
            <label style={{ display: "block", marginTop: 12 }}>
              Question
              <textarea value={title} onChange={e => setTitle(e.target.value)} required style={{ width: "100%", minHeight: 120, padding: 10, borderRadius: 6, border: "1px solid #e6e6e6" }} placeholder="Enter the question text..." />
            </label>

            <label style={{ display: "block", marginTop: 8 }}>
              Upload image (question)
              <div style={{ marginTop: 6 }}>
                <input type="file" accept="image/*" onChange={e => onUploadImage(setTitleImage, e.target.files[0])} />
                {titleImage && <div style={{ marginTop: 8 }}><img src={titleImage} alt="q" style={{ maxWidth: 220 }} /></div>}
              </div>
            </label>

            {/* options / numeric answer */}
            {(type === "SAQ" || type === "MAQ") && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Options</div>
                {options.map((opt, i) => (
                  <div key={opt.id} style={{ border: "1px solid #ececec", padding: 10, borderRadius: 6, marginBottom: 8 }}>
                    <div style={{ marginBottom: 6, fontWeight: 600 }}>Option {i + 1}</div>
                    <textarea placeholder={`Enter option text...`} value={opt.text} onChange={e => updateOption(opt.id, { text: e.target.value })} style={{ width: "100%", minHeight: 60, padding: 8, borderRadius: 6, border: "1px solid #e6e6e6" }} />
                    <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                      {type === "MAQ" ? (
                        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="checkbox" checked={!!opt.correct} onChange={e => updateOption(opt.id, { correct: e.target.checked })} />
                          <span style={{ fontSize: 13 }}>Correct</span>
                        </label>
                      ) : (
                        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="radio" name="saq_correct" checked={!!opt.correct} onChange={() => setOptions(prev => prev.map(o => ({ ...o, correct: o.id === opt.id })))} />
                          <span style={{ fontSize: 13 }}>Correct</span>
                        </label>
                      )}
                      <div style={{ marginLeft: "auto" }}>
                        <input type="file" accept="image/*" onChange={e => onUploadImage(img => updateOption(opt.id, { image: img }), e.target.files[0])} />
                        <button type="button" onClick={() => removeOption(opt.id)} style={{ marginLeft: 8 }}>Remove</button>
                      </div>
                    </div>
                    {opt.image && <div style={{ marginTop: 8 }}><img src={opt.image} alt="opt" style={{ maxWidth: 200 }} /></div>}
                  </div>
                ))}

                <div style={{ marginTop: 6 }}>
                  <button type="button" onClick={addOption} style={{ padding: "8px 12px", borderRadius: 6, background: "#f1f7ff", border: "1px solid #e6f0ff", cursor: "pointer" }}>+ Add Option</button>
                </div>
              </div>
            )}

            {type === "True/False" && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700 }}>Answer</div>
                {options.map(o => (
                  <label key={o.id} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <input type="radio" name="tf" checked={o.correct} onChange={() => setOptions(prev => prev.map(x => ({ ...x, correct: x.id === o.id })))} />
                    <span>{o.text}</span>
                  </label>
                ))}
              </div>
            )}

            {type === "Numerical" && (
              <label style={{ display: "block", marginTop: 12 }}>
                Numeric answer
                <input value={numericAnswer} onChange={e => setNumericAnswer(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e6e6e6" }} />
              </label>
            )}

            <label style={{ display: "block", marginTop: 12 }}>
              Solution (optional)
              <textarea value={solution} onChange={e => setSolution(e.target.value)} style={{ width: "100%", minHeight: 120, padding: 10, borderRadius: 6, border: "1px solid #e6e6e6" }} placeholder="Enter solution text..." />
            </label>

            <label style={{ display: "block", marginTop: 8 }}>
              Upload image (solution)
              <div style={{ marginTop: 6 }}>
                <input type="file" accept="image/*" onChange={e => onUploadImage(setSolutionImage, e.target.files[0])} />
                {solutionImage && <div style={{ marginTop: 8 }}><img src={solutionImage} alt="sol" style={{ maxWidth: 220 }} /></div>}
              </div>
            </label>

            <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
              <button type="button" onClick={onClose} style={{ padding: "8px 12px", borderRadius: 6 }}>Cancel</button>
              <button type="submit" style={{ padding: "8px 14px", borderRadius: 6, background: "#0b74ff", color: "#fff", border: "none" }}>Save</button>
            </div>
          </form>
        </div>

        {/* right: live preview */}
        <div style={{ width: 360, borderLeft: "1px solid #f0f0f0", paddingLeft: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Live Preview</div>
          <LivePreview type={type} title={title} titleImage={titleImage} options={options} numericAnswer={numericAnswer} solution={solution} solutionImage={solutionImage} />
        </div>
      </div>
    </div>
  );
}

/* --------------------------
   Live Preview component
   -------------------------- */
function LivePreview({ type, title, titleImage, options, numericAnswer, solution, solutionImage }) {
  return (
    <div>
      <div style={{ padding: 8, border: "1px solid #f0f0f0", borderRadius: 6, background: "#fafafa" }}>
        <div style={{ fontSize: 14, color: "#333", marginBottom: 8 }}><strong>{type}</strong></div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 600 }}>{title || "Question title..."}</div>
          {titleImage && <div style={{ marginTop: 8 }}><img src={titleImage} alt="preview-q" style={{ maxWidth: "100%" }} /></div>}
        </div>

        {(type === "SAQ" || type === "MAQ" || type === "True/False") && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Options</div>
            {options?.map((o, i) => (
              <div key={o.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                {type === "MAQ" ? <input type="checkbox" checked={!!o.correct} readOnly /> : <input type="radio" checked={!!o.correct} readOnly />}
                <div>
                  <div>{o.text || `Option ${i + 1}`}</div>
                  {o.image && <img src={o.image} alt="opt" style={{ maxWidth: 160, marginTop: 4 }} />}
                </div>
              </div>
            ))}
          </div>
        )}

        {type === "Numerical" && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 600 }}>Answer</div>
            <div>{numericAnswer || "Numeric answer preview"}</div>
          </div>
        )}

        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 600 }}>Solution</div>
          <div style={{ color: "#333" }}>{solution || "No solution provided"}</div>
          {solutionImage && <div style={{ marginTop: 6 }}><img src={solutionImage} alt="sol" style={{ maxWidth: "100%" }} /></div>}
        </div>
      </div>
    </div>
  );
}
