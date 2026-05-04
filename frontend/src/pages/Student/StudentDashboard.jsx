import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [purchasedQuizzes, setPurchasedQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [quizRes, purchaseRes, resultRes] = await Promise.all([
          axios.get('http://localhost:5001/api/quizzes'),
          axios.get('http://localhost:5001/api/payments/my-purchases'),
          axios.get('http://localhost:5001/api/results/my-results')
        ]);
        
        setQuizzes(quizRes.data);
        setPurchasedQuizzes(purchaseRes.data);
        setResults(resultRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const buyQuiz = async (quizId, price) => {
    // Sandbox Payment Mock
    const confirmPurchase = window.confirm(`Mock Payment: Confirm purchase for $${price}?`);
    if (!confirmPurchase) return;

    try {
      await axios.post('http://localhost:5001/api/payments/buy', { quizId, cardDetails: 'mock' });
      alert("Purchase successful!");
      setPurchasedQuizzes([...purchasedQuizzes, quizId]);
    } catch (err) {
      alert(err.response?.data?.msg || "Purchase failed");
    }
  };

  if (loading) return <div className="container text-center mt-2">Loading...</div>;

  const totalQuizzesTaken = results.length;
  const avgScore = totalQuizzesTaken > 0 
    ? (results.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / totalQuizzesTaken).toFixed(1)
    : 0;

  return (
    <div>
      <nav className="navbar">
        <div className="nav-brand">QuizMaster Student</div>
        <div className="nav-links">
          <span className="nav-link">{user.name}</span>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container mt-2">
        <div className="grid mb-2">
          <div className="glass-card text-center">
            <h3>Total Quizzes Taken</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalQuizzesTaken}</div>
          </div>
          <div className="glass-card text-center">
            <h3>Average Score</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{avgScore}%</div>
          </div>
        </div>

        <h2 className="mb-1">Available Quizzes</h2>
        <div className="grid">
          {quizzes.map(quiz => {
            const hasPurchased = purchasedQuizzes.includes(quiz._id);
            const canTake = quiz.isFree || hasPurchased;

            return (
              <div key={quiz._id} className="glass-card flex" style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3>{quiz.title}</h3>
                    <span className={`badge ${quiz.isFree ? 'badge-free' : 'badge-paid'}`}>
                      {quiz.isFree ? 'Free' : `$${quiz.price}`}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{quiz.description}</p>
                </div>
                
                {canTake ? (
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate(`/take-quiz/${quiz._id}`)}>
                    Take Quiz
                  </button>
                ) : (
                  <button className="btn btn-success" style={{ width: '100%' }} onClick={() => buyQuiz(quiz._id, quiz.price)}>
                    Buy Access for ${quiz.price}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <h2 className="mt-2 mb-1">My Attempt History</h2>
        {results.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>You haven't taken any quizzes yet.</p>
        ) : (
          <div className="grid">
            {results.map((r, i) => (
              <div key={i} className="glass-card">
                <h3>{r.quizId?.title || 'Unknown Quiz'}</h3>
                <p style={{ color: 'var(--text-muted)' }}>Attempted on: {new Date(r.createdAt).toLocaleDateString()}</p>
                <div className="mt-1 flex justify-between items-center">
                  <span>Score:</span>
                  <strong style={{ color: 'var(--success)', fontSize: '1.5rem' }}>
                    {r.score}/{r.totalQuestions} ({((r.score/r.totalQuestions)*100).toFixed(0)}%)
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;