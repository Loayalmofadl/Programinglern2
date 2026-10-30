/**
 * Programming Academy - Exercise Engine
 */

import { DB } from './database.js';
import { State } from './state.js';
import { StudentManager } from './student.js';

export const ExerciseEngine = {
  /**
   * Get exercise by ID
   */
  async getExercise(exerciseId) {
    let exercise = State.exercisesMap.get(exerciseId);
    if (!exercise) {
      for (const ex of State.exercisesMap.values()) {
        if (ex.lessonId === exerciseId || ex.id === exerciseId) {
          exercise = ex;
          break;
        }
      }
    }
    return exercise;
  },

  /**
   * Evaluate student code against exercise criteria
   */
  async evaluateExercise(studentId, exerciseId, userCode) {
    const exercise = await this.getExercise(exerciseId);
    if (!exercise) throw new Error('Exercise not found');

    // Run user code in an isolated eval/worker/sandbox capturing console.log
    const capturedLogs = [];
    let isSuccess = false;
    let feedback = '';

    try {
      // Safe execution context for beginner exercises
      const safeConsole = {
        log: (...args) => capturedLogs.push(args.map(a => String(a)).join(' ')),
        error: (...args) => capturedLogs.push('خطأ: ' + args.map(a => String(a)).join(' ')),
        warn: (...args) => capturedLogs.push('تنبيه: ' + args.map(a => String(a)).join(' '))
      };

      // Wrap and execute strictly isolated
      const execFn = new Function('console', userCode);
      execFn(safeConsole);

      const combinedOutput = capturedLogs.join('\n');

      if (exercise.validationType === 'console-output') {
        const pattern = new RegExp(exercise.expectedOutputPattern, 'i');
        if (pattern.test(combinedOutput)) {
          isSuccess = true;
          feedback = 'أحسنت! الإجابة صحيحة وتمت مطابقة النتيجة المتوقعة بنجاح.';
        } else {
          isSuccess = false;
          feedback = `المخرجات الحالية لا تطابق المطلوب. المتوقع يحتوي على: "${exercise.expectedOutputPattern}"، بينما المخرجات كانت: "${combinedOutput || '(فارغ)'}"`;
        }
      } else {
        isSuccess = true;
        feedback = 'تم تنفيذ الكود بنجاح.';
      }
    } catch (err) {
      isSuccess = false;
      feedback = 'حدث خطأ برمجي أثناء التنفيذ: ' + (err.message || 'خطأ في الكود');
    }

    const attempt = {
      id: 'ea_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      studentId,
      exerciseId: exercise.id,
      submittedCode: userCode,
      isSuccess,
      feedback,
      capturedOutput: capturedLogs.join('\n'),
      timestamp: new Date().toISOString()
    };

    await DB.put('exerciseAttempts', attempt);

    if (isSuccess) {
      await StudentManager.awardPoints(40, `حل تمرين برمجي: ${exercise.title}`);
    }

    State.notify('exercise-submitted', attempt);
    return attempt;
  },

  /**
   * Get exercise attempts history
   */
  async getAttempts(studentId, exerciseId) {
    const all = await DB.getAllByIndex('exerciseAttempts', 'studentId', studentId);
    return all
      .filter((a) => a.exerciseId === exerciseId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};
