/**
 * Programming Academy - Backup & Restore Engine
 * Versioned local JSON data export and safe validation/import
 */

import { DB } from './database.js';
import { State } from './state.js';

const BACKUP_SCHEMA_VERSION = '1.0.0';

export const BackupEngine = {
  /**
   * Export all data for the active student (or all students) into a structured JSON file
   */
  async exportBackup(studentId) {
    const [
      students,
      lessonProgress,
      quizAttempts,
      exerciseAttempts,
      notes,
      bookmarks,
      achievements,
      savedCode
    ] = await Promise.all([
      studentId ? [await DB.get('students', studentId)] : DB.getAll('students'),
      studentId ? DB.getAllByIndex('lessonProgress', 'studentId', studentId) : DB.getAll('lessonProgress'),
      studentId ? DB.getAllByIndex('quizAttempts', 'studentId', studentId) : DB.getAll('quizAttempts'),
      studentId ? DB.getAllByIndex('exerciseAttempts', 'studentId', studentId) : DB.getAll('exerciseAttempts'),
      studentId ? DB.getAllByIndex('notes', 'studentId', studentId) : DB.getAll('notes'),
      studentId ? DB.getAllByIndex('bookmarks', 'studentId', studentId) : DB.getAll('bookmarks'),
      studentId ? DB.getAllByIndex('achievements', 'studentId', studentId) : DB.getAll('achievements'),
      studentId ? DB.getAllByIndex('savedCode', 'studentId', studentId) : DB.getAll('savedCode')
    ]);

    const backupPayload = {
      app: 'Programming Academy',
      version: BACKUP_SCHEMA_VERSION,
      exportDate: new Date().toISOString(),
      studentId: studentId || 'all',
      data: {
        students: (students || []).filter(Boolean),
        lessonProgress: lessonProgress || [],
        quizAttempts: quizAttempts || [],
        exerciseAttempts: exerciseAttempts || [],
        notes: notes || [],
        bookmarks: bookmarks || [],
        achievements: achievements || [],
        savedCode: savedCode || []
      }
    };

    const jsonString = JSON.stringify(backupPayload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeDate = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `programming-academy-backup-${safeDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return backupPayload;
  },

  /**
   * Validate and parse a backup file
   */
  validateBackup(jsonString) {
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      throw new Error('الملف ليس بصيغة JSON صالحة.');
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('بنية ملف النسخة الاحتياطية غير صالحة.');
    }

    if (parsed.app !== 'Programming Academy' && !parsed.data) {
      throw new Error('الملف لا ينتمي لمنصة أكاديمية البرمجة.');
    }

    if (!parsed.data || typeof parsed.data !== 'object') {
      throw new Error('لا توجد بيانات صالحة داخل ملف النسخة الاحتياطية.');
    }

    return parsed;
  },

  /**
   * Import verified backup into IndexedDB
   */
  async restoreBackup(parsedBackup) {
    const { data } = parsedBackup;
    let importedCounts = {
      students: 0,
      lessonProgress: 0,
      quizAttempts: 0,
      exerciseAttempts: 0,
      notes: 0,
      bookmarks: 0,
      achievements: 0,
      savedCode: 0
    };

    // Safely write to each store avoiding corruption
    if (Array.isArray(data.students)) {
      for (const item of data.students) {
        if (item.id && item.name) {
          await DB.put('students', item);
          importedCounts.students++;
        }
      }
    }

    if (Array.isArray(data.lessonProgress)) {
      for (const item of data.lessonProgress) {
        if (item.id) {
          await DB.put('lessonProgress', item);
          importedCounts.lessonProgress++;
        }
      }
    }

    if (Array.isArray(data.quizAttempts)) {
      for (const item of data.quizAttempts) {
        if (item.id) {
          await DB.put('quizAttempts', item);
          importedCounts.quizAttempts++;
        }
      }
    }

    if (Array.isArray(data.exerciseAttempts)) {
      for (const item of data.exerciseAttempts) {
        if (item.id) {
          await DB.put('exerciseAttempts', item);
          importedCounts.exerciseAttempts++;
        }
      }
    }

    if (Array.isArray(data.notes)) {
      for (const item of data.notes) {
        if (item.id) {
          await DB.put('notes', item);
          importedCounts.notes++;
        }
      }
    }

    if (Array.isArray(data.bookmarks)) {
      for (const item of data.bookmarks) {
        if (item.id) {
          await DB.put('bookmarks', item);
          importedCounts.bookmarks++;
        }
      }
    }

    if (Array.isArray(data.achievements)) {
      for (const item of data.achievements) {
        if (item.id) {
          await DB.put('achievements', item);
          importedCounts.achievements++;
        }
      }
    }

    if (Array.isArray(data.savedCode)) {
      for (const item of data.savedCode) {
        if (item.id) {
          await DB.put('savedCode', item);
          importedCounts.savedCode++;
        }
      }
    }

    State.notify('backup-restored', importedCounts);
    return importedCounts;
  },

  /**
   * Reset learning progress with safety check
   */
  async resetStudentProgress(studentId) {
    if (!studentId) return;

    // Delete progress, quiz attempts, exercise attempts
    const [progressList, quizzesList, exercisesList] = await Promise.all([
      DB.getAllByIndex('lessonProgress', 'studentId', studentId),
      DB.getAllByIndex('quizAttempts', 'studentId', studentId),
      DB.getAllByIndex('exerciseAttempts', 'studentId', studentId)
    ]);

    for (const p of progressList) await DB.delete('lessonProgress', p.id);
    for (const q of quizzesList) await DB.delete('quizAttempts', q.id);
    for (const e of exercisesList) await DB.delete('exerciseAttempts', e.id);

    // Reset student score and streak
    const student = await DB.get('students', studentId);
    if (student) {
      student.points = 0;
      student.level = 1;
      student.completedLessonsCount = 0;
      student.completedCoursesCount = 0;
      await DB.put('students', student);
      State.setCurrentStudent(student);
    }

    State.notify('progress-reset', { studentId });
  }
};
