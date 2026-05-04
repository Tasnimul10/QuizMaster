const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ['MCQ', 'Short', 'TF'], required: true },
  questionText: { type: String, required: true },
  options: [{ type: String }], // Used for MCQ
  correctAnswer: { type: String, required: true }, // For short answer, MCQ option, or 'true'/'false'
  explanation: { type: String, required: true }
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [QuestionSchema],
  isFree: { type: Boolean, default: true },
  price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);
