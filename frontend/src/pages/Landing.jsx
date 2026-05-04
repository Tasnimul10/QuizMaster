import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="container flex items-center justify-between" style={{ minHeight: '80vh', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="text-center mb-2">
        <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>QuizMaster Platform</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          The ultimate platform for learning and teaching. Create engaging quizzes, test your knowledge, and track your progress in real-time.
        </p>
      </div>

      <div className="grid" style={{ width: '100%', maxWidth: '800px', gap: '2rem' }}>
        <div className="glass-card text-center" style={{ padding: '3rem 2rem' }}>
          <h2 style={{ color: 'var(--secondary-color)' }}>I am a Student</h2>
          <p className="mb-2" style={{ color: 'var(--text-muted)' }}>Take free and paid quizzes, review your answers, and compete with your peers.</p>
          <button className="btn btn-primary" onClick={() => navigate('/register', { state: { selectedRole: 'student' } })}>
            Join as Student
          </button>
        </div>

        <div className="glass-card text-center" style={{ padding: '3rem 2rem' }}>
          <h2 style={{ color: 'var(--success)' }}>I am a Teacher</h2>
          <p className="mb-2" style={{ color: 'var(--text-muted)' }}>Create comprehensive quizzes, monetize your knowledge, and view student analytics.</p>
          <button className="btn btn-secondary" onClick={() => navigate('/register', { state: { selectedRole: 'teacher' } })}>
            Join as Teacher
          </button>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <p style={{ color: 'var(--text-muted)' }}>Already have an account?</p>
        <button className="btn" style={{ background: 'transparent', color: 'var(--primary-color)' }} onClick={() => navigate('/login')}>
          Login Here
        </button>
      </div>
    </div>
  );
};

export default Landing;