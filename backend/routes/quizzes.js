const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { auth, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/quizzes
// @desc    Create a quiz (Teacher only)
router.post('/', auth, authorize('teacher'), async (req, res) => {
  try {
    const { title, description, questions, isFree, price } = req.body;
    
    const newQuiz = new Quiz({
      title,
      description,
      questions,
      isFree,
      price,
      teacherId: req.user.id
    });

    const quiz = await newQuiz.save();
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/quizzes
// @desc    Get all quizzes (For students)
router.get('/', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('-questions.correctAnswer -questions.explanation');
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/quizzes/teacher
// @desc    Get teacher's own quizzes
router.get('/teacher', auth, authorize('teacher'), async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacherId: req.user.id });
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get quiz by ID (Includes answers if teacher owner, else removes them)
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    // If it's a student, we don't want to send correct answers/explanations before they finish
    // However, if they bought it or it's free, they can access it.
    // For simplicity, we'll send it without answers if role is student.
    // We'll let the frontend verify answers, or better, the backend does it on submit.
    if (req.user.role === 'student') {
        const studentQuiz = quiz.toObject();
        studentQuiz.questions.forEach(q => {
            delete q.correctAnswer;
            delete q.explanation;
        });
        return res.json(studentQuiz);
    }

    // Teacher or admin gets full quiz
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Quiz not found' });
    res.status(500).send('Server Error');
  }
});

module.exports = router;
