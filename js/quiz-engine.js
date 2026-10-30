/**
 * Programming Academy - Quiz Engine
 */

import { DB } from './database.js';
import { State } from './state.js';
import { StudentManager } from './student.js';

export const QuizEngine = {
  /**
   * Get quiz by quiz ID or lesson ID
   */
  async getQuiz(quizId) {
    let quiz = State.quizzesMap.get(quizId);
    if (!quiz) {
      for (const q of State.quizzesMap.values()) {
        if (q.lessonId === quizId || q.id === quizId) {
          quiz = q;
          break;
        }
      }
    }
    return quiz;
  },

  /**
   * Evaluate a student's quiz submission
   */
  async submitQuiz(studentId, quizId, userAnswers) {
    const quiz = await this.getQuiz(quizId);
    if (!quiz) throw new Error('Quiz not found');

    let correctCount = 0;
    const questionsBreakdown = quiz.questions.map((q) => {
      const selectedIndex = userAnswers[q.id];
      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        prompt: q.prompt,
        selectedIndex,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = quiz.questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = scorePercentage >= (quiz.passingScore || 70);

    const attempt = {
      id: 'qa_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      studentId,
      quizId: quiz.id,
      lessonId: quiz.lessonId,
      scorePercentage,
      correctCount,
      totalQuestions,
      isPassed,
      breakdown: questionsBreakdown,
      timestamp: new Date().toISOString()
    };

    await DB.put('quizAttempts', attempt);

    if (isPassed) {
      await StudentManager.awardPoints(50, `اجتياز اختبار: ${quiz.title}`);
    }

    State.notify('quiz-submitted', attempt);
    return attempt;
  },

  /**
   * Get previous attempts for a quiz
   */
  async getQuizAttempts(studentId, quizId) {
    const allAttempts = await DB.getAllByIndex('quizAttempts', 'studentId', studentId);
    return allAttempts
      .filter((a) => a.quizId === quizId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};
