import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizBuilder = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(0);
  const [questions, setQuestions] = useState([]);
  
  // Current Question State
  const [qType, setQType] = useState('MCQ');
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']); // For MCQ
  const [qCorrect, setQCorrect] = useState('');
  const [qExplanation, setQExplanation] = useState('');

  const addQuestion = () => {
    if (!qText || !qCorrect || !qExplanation) return alert("Please fill all question fields.");
    if (questions.length >= 10) return alert("Maximum 10 questions allowed.");

    let formattedCorrect = qCorrect;
    if (qType === 'MCQ') {
      if (!qOptions.includes(qCorrect)) return alert("Correct answer must be one of the options.");
    } else if (qType === 'TF') {
      if (qCorrect.toLowerCase() !== 'true' && qCorrect.toLowerCase() !== 'false') {
         return alert("Correct answer must be 'True' or 'False'.");
      }
    }

    const newQ = {
      type: qType,
      questionText: qText,
      options: qType === 'MCQ' ? qOptions.filter(o => o.trim() !== '') : [],
      correctAnswer: formattedCorrect,
      explanation: qExplanation
    };

    setQuestions([...questions, newQ]);
    
    // Reset Form
    setQText('');
    setQOptions(['', '', '', '']);
    setQCorrect('');
    setQExplanation('');
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...qOptions];
    newOptions[index] = value;
    setQOptions(newOptions);
  };

  const saveQuiz = async () => {
    if (!title || !description || questions.length === 0) {
      return alert("Please add a title, description, and at least one question.");
    }
    if (!isFree && price <= 0) {
      return alert("Paid quizzes must have a price greater than 0.");
    }

    try {
      await axios.post('http://localhost:5001/api/quizzes', {
        title,
        description,
        isFree,
        price: isFree ? 0 : price,
        questions
      });
      alert("Quiz created successfully!");
      navigate('/teacher-dashboard');
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz.");
    }
  };

  return (
    <div className="container mt-2">
      <div className="flex justify-between items-center mb-2">
        <h2>Build New Quiz</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/teacher-dashboard')}>Cancel</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Left Side: Quiz Settings */}
        <div className="glass-card">
          <h3 className="mb-1">Quiz Settings</h3>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. React Basics" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} rows="3" placeholder="What is this quiz about?" />
          </div>
          <div className="form-group flex justify-between items-center">
            <label className="form-label" style={{ marginBottom: 0 }}>Is Free?</label>
            <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} style={{ transform: 'scale(1.5)' }} />
          </div>
          {!isFree && (
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input type="number" className="form-input" value={price} onChange={e => setPrice(e.target.value)} min="1" />
            </div>
          )}
          
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />
          
          <h3 className="mb-1">Questions Summary ({questions.length}/10)</h3>
          {questions.map((q, i) => (
            <div key={i} className="mb-1" style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
              <span className={`badge ${q.type === 'MCQ' ? 'badge-paid' : 'badge-free'}`} style={{ marginRight: '10px' }}>{q.type}</span>
              {q.questionText.substring(0, 30)}...
            </div>
          ))}

          <button className="btn btn-success mt-2" style={{ width: '100%' }} onClick={saveQuiz}>
            Publish Quiz
          </button>
        </div>

        {/* Right Side: Add Question */}
        <div className="glass-card">
          <h3 className="mb-1">Add Question</h3>
          
          <div className="form-group">
            <label className="form-label">Question Type</label>
            <select className="form-input" value={qType} onChange={e => setQType(e.target.value)}>
              <option value="MCQ">Multiple Choice</option>
              <option value="Short">Short Answer</option>
              <option value="TF">True / False</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Question Text</label>
            <input type="text" className="form-input" value={qText} onChange={e => setQText(e.target.value)} />
          </div>

          {qType === 'MCQ' && (
            <div className="form-group">
              <label className="form-label">Options</label>
              {qOptions.map((opt, i) => (
                <input key={i} type="text" className="form-input mb-1" placeholder={`Option ${i+1}`} value={opt} onChange={e => handleOptionChange(i, e.target.value)} />
              ))}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Correct Answer</label>
            {qType === 'TF' ? (
               <select className="form-input" value={qCorrect} onChange={e => setQCorrect(e.target.value)}>
                 <option value="">Select True or False</option>
                 <option value="True">True</option>
                 <option value="False">False</option>
               </select>
            ) : (
               <input type="text" className="form-input" placeholder="Type the exact correct answer" value={qCorrect} onChange={e => setQCorrect(e.target.value)} />
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Explanation (Why/How)</label>
            <textarea className="form-input" rows="2" value={qExplanation} onChange={e => setQExplanation(e.target.value)} placeholder="Explain the correct answer..." />
          </div>

          <button className="btn btn-primary" onClick={addQuestion} disabled={questions.length >= 10}>
            Add Question to Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;
