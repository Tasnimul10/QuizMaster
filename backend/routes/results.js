const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const { auth, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/results/submit
// @desc    Submit quiz answers and calculate score
router.post('/submit', auth, authorize('student'), async (req, res) => {
  try {
    const { quizId, answers } = req.body; // answers: [{ questionId, userAnswer }]
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    let score = 0;
    const processedAnswers = answers.map(ans => {
        const question = quiz.questions.id(ans.questionId);
        const isCorrect = question.correctAnswer.toLowerCase().trim() === ans.userAnswer.toLowerCase().trim();
        if (isCorrect) score++;
        return {
            questionId: ans.questionId,
            userAnswer: ans.userAnswer,
            isCorrect
        };
    });

    const newResult = new Result({
        studentId: req.user.id,
        quizId,
        score,
        totalQuestions: quiz.questions.length,
        answers: processedAnswers
    });

    const result = await newResult.save();
    
    // Return result with explanations so student can review
    res.json({ result, quiz: quiz });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/results/my-results
// @desc    Get student's own results
router.get('/my-results', auth, authorize('student'), async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user.id }).populate('quizId', ['title', 'description']);
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/results/quiz/:quizId
// @desc    Get all results for a specific quiz (Teacher only)
router.get('/quiz/:quizId', auth, authorize('teacher'), async (req, res) => {
  try {
    // Check if teacher owns this quiz
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    if (quiz.teacherId.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Unauthorized' });
    }

    const results = await Result.find({ quizId: req.params.quizId }).populate('studentId', ['name', 'email']);
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/results/all
// @desc    Get all results (Admin only)
router.get('/all', auth, authorize('admin'), async (req, res) => {
  try {
    const results = await Result.find().populate('studentId', ['name']).populate('quizId', ['title']);
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
