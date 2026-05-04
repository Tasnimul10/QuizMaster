import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState({}); // Map of quizId -> results
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      // 1. Fetch wallet balance (Wrap in separate try/catch so it doesn't break the whole page if it fails)
      try {
        const userRes = await axios.get('http://localhost:5001/api/auth/me', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setWalletBalance(userRes.data.walletBalance || 0);
      } catch (err) {
        console.error("Failed to fetch wallet balance (Did you restart the backend?):", err);
      }

      // 2. Fetch quizzes and results
      try {
        const quizRes = await axios.get('http://localhost:5001/api/quizzes/teacher', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        const teacherQuizzes = quizRes.data;
        setQuizzes(teacherQuizzes);

        // Fetch results for each quiz to get analytics
        const resultsMap = {};
        for (let q of teacherQuizzes) {
          const resRes = await axios.get(`http://localhost:5001/api/results/quiz/${q._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
          resultsMap[q._id] = resRes.data;
        }
        setResults(resultsMap);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="container text-center mt-2">Loading...</div>;

  return (
    <div>
      <nav className="navbar">
        <div className="nav-brand">QuizMaster Teacher</div>
        <div className="nav-links">
          <span className="nav-link" style={{color: 'var(--success)'}}>Earnings: ${walletBalance}</span>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container mt-2">
        <div className="flex justify-between items-center mb-2">
          <h2>My Quizzes</h2>
          <button className="btn btn-primary" onClick={() => navigate('/build-quiz')}>+ Create New Quiz</button>
        </div>

        {quizzes.length === 0 ? (
          <div className="glass-card text-center" style={{ padding: '3rem' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>You haven't created any quizzes yet.</h3>
          </div>
        ) : (
          <div className="grid">
            {quizzes.map(quiz => {
              const quizResults = results[quiz._id] || [];
              const attempts = quizResults.length;
              const avgScore = attempts > 0 
                ? (quizResults.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / attempts).toFixed(1)
                : 0;

              return (
                <div key={quiz._id} className="glass-card">
                  <div className="flex justify-between items-center mb-1">
                    <h3>{quiz.title}</h3>
                    <span className={`badge ${quiz.isFree ? 'badge-free' : 'badge-paid'}`}>
                      {quiz.isFree ? 'Free' : `$${quiz.price}`}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', height: '40px', overflow: 'hidden' }}>
                    {quiz.description}
                  </p>
                  
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: 'var(--text-muted)' }}>Questions</span>
                      <strong style={{ color: 'var(--text-light)' }}>{quiz.questions.length}</strong>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: 'var(--text-muted)' }}>Total Attempts</span>
                      <strong style={{ color: 'var(--text-light)' }}>{attempts}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>Average Score</span>
                      <strong style={{ color: 'var(--success)' }}>{avgScore}%</strong>
                    </div>
                  </div>
                  
                  <button className="btn btn-secondary" style={{ width: '100%' }}>View Detailed Stats</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;