const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/payments/buy
// @desc    Mock purchase a quiz
router.post('/buy', auth, authorize('student'), async (req, res) => {
  try {
    const { quizId, cardDetails } = req.body;
    
    // In a real app, we'd use Stripe/SSLCommerz here with cardDetails.
    // For Sandbox, we just verify the quiz and simulate success.
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    if (quiz.isFree) return res.status(400).json({ msg: 'Quiz is free' });

    // Check if already bought
    const existingTransaction = await Transaction.findOne({ studentId: req.user.id, quizId });
    if (existingTransaction) {
        return res.status(400).json({ msg: 'You have already purchased this quiz' });
    }

    const amountPaid = quiz.price;
    const teacherEarnings = amountPaid / 2;
    const platformEarnings = amountPaid / 2;

    const newTransaction = new Transaction({
        studentId: req.user.id,
        quizId,
        amountPaid,
        teacherEarnings,
        platformEarnings
    });

    await newTransaction.save();

    // Update teacher's wallet balance
    await User.findByIdAndUpdate(quiz.teacherId, {
        $inc: { walletBalance: teacherEarnings }
    });

    res.json({ msg: 'Payment successful', transaction: newTransaction });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/payments/my-purchases
// @desc    Get student's purchases
router.get('/my-purchases', auth, authorize('student'), async (req, res) => {
    try {
        const transactions = await Transaction.find({ studentId: req.user.id });
        const purchasedQuizIds = transactions.map(t => t.quizId);
        res.json(purchasedQuizIds);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
