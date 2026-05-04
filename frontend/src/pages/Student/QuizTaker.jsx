import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizTaker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // questionId -> answer
  const [result, setResult] = useState(null); // Result after submission
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/quizzes/${id}`);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load quiz or unauthorized.");
        navigate('/student-dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      if(!window.confirm("You haven't answered all questions. Submit anyway?")) return;
    }

    const formattedAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      userAnswer: answers[qId]
    }));

    try {
      const res = await axios.post('http://localhost:5001/api/results/submit', {
        quizId: id,
        answers: formattedAnswers
      });
      // The backend returns the full quiz (with explanations) along with the result
      setResult(res.data); 
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz.");
    }
  };

  if (loading) return <div className="container text-center mt-2">Loading...</div>;
  if (!quiz) return <div className="container text-center mt-2">Quiz not found.</div>;

  if (result) {
    const r = result.result;
    const fullQuiz = result.quiz;
    return (
      <div className="container mt-2">
        <div className="glass-card text-center mb-2">
          <h2>Quiz Completed!</h2>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>
            {r.score} / {r.totalQuestions}
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Score: {((r.score/r.totalQuestions)*100).toFixed(1)}%</p>
          <button className="btn btn-primary mt-1" onClick={() => navigate('/student-dashboard')}>Back to Dashboard</button>
        </div>

        <h3>Review & Explanations</h3>
        {fullQuiz.questions.map((q, idx) => {
          const userAnsObj = r.answers.find(a => a.questionId.toString() === q._id.toString());
          const isCorrect = userAnsObj?.isCorrect;
          
          return (
            <div key={q._id} className="glass-card mb-1" style={{ borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}` }}>
              <h4>{idx + 1}. {q.questionText}</h4>
              <div className="mt-1 mb-1">
                <span style={{ color: 'var(--text-muted)' }}>Your Answer: </span>
                <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                  {userAnsObj?.userAnswer || 'Not answered'}
                </strong>
              </div>
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ color: 'var(--success)', fontWeight: 'bold' }}>Correct Answer: {q.correctAnswer}</p>
                <p className="mt-1" style={{ color: 'var(--text-light)' }}><strong>Explanation:</strong> {q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="container mt-2">
      <div className="glass-card mb-2">
        <h2>{quiz.title}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{quiz.description}</p>
      </div>

      {quiz.questions.map((q, idx) => (
        <div key={q._id} className="glass-card mb-1">
          <h4 className="mb-1">{idx + 1}. {q.questionText}</h4>
          
          {q.type === 'MCQ' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {q.options.map((opt, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                  <input 
                    type="radio" 
                    name={q._id} 
                    value={opt} 
                    onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                    style={{ marginRight: '10px' }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {q.type === 'TF' && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                <input type="radio" name={q._id} value="True" onChange={(e) => handleAnswerChange(q._id, e.target.value)} style={{ marginRight: '10px' }} />
                True
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                <input type="radio" name={q._id} value="False" onChange={(e) => handleAnswerChange(q._id, e.target.value)} style={{ marginRight: '10px' }} />
                False
              </label>
            </div>
          )}

          {q.type === 'Short' && (
            <input 
              type="text" 
              className="form-input" 
              placeholder="Type your answer here"
              onChange={(e) => handleAnswerChange(q._id, e.target.value)}
            />
          )}
        </div>
      ))}

      <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }} onClick={submitQuiz}>
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizTaker;
