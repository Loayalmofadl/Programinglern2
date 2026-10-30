/**
 * Programming Academy - Lesson Engine
 */

import { DB } from './database.js';
import { State } from './state.js';
import { StudentManager } from './student.js';

export const LessonEngine = {
  /**
   * Get lesson by ID
   */
  async getLesson(lessonId) {
    let lesson = State.lessonsMap.get(lessonId);
    if (!lesson) {
      lesson = await DB.get('lessons', lessonId);
      if (lesson) State.lessonsMap.set(lessonId, lesson);
    }
    return lesson;
  },

  /**
   * Get completion status for a lesson
   */
  async getLessonProgress(studentId, lessonId) {
    if (!studentId || !lessonId) return { isCompleted: false };
    const id = `${studentId}_${lessonId}`;
    const progress = await DB.get('lessonProgress', id);
    return progress || { isCompleted: false };
  },

  /**
   * Toggle lesson completion status
   */
  async toggleLessonCompletion(studentId, lessonId) {
    if (!studentId || !lessonId) return false;
    const id = `${studentId}_${lessonId}`;
    const existing = await DB.get('lessonProgress', id);
    const newStatus = !existing?.isCompleted;

    const progressRecord = {
      id,
      studentId,
      lessonId,
      isCompleted: newStatus,
      completedAt: newStatus ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };

    await DB.put('lessonProgress', progressRecord);

    if (newStatus) {
      // Award 25 XP for completing a lesson!
      await StudentManager.awardPoints(25, 'إكمال درس بنجاح');
      
      // Update completed lessons count in student profile
      if (State.currentStudent) {
        const allProgress = await DB.getAllByIndex('lessonProgress', 'studentId', studentId);
        State.currentStudent.completedLessonsCount = allProgress.filter((p) => p.isCompleted).length;
        await DB.put('students', State.currentStudent);
      }
    }

    State.notify('lesson-progress-updated', { lessonId, isCompleted: newStatus });
    return newStatus;
  },

  /**
   * Bookmark management
   */
  async isBookmarked(studentId, lessonId) {
    if (!studentId || !lessonId) return false;
    const id = `${studentId}_${lessonId}`;
    const bm = await DB.get('bookmarks', id);
    return !!bm;
  },

  async toggleBookmark(studentId, lessonId, lessonTitle) {
    if (!studentId || !lessonId) return false;
    const id = `${studentId}_${lessonId}`;
    const existing = await DB.get('bookmarks', id);

    if (existing) {
      await DB.delete('bookmarks', id);
      State.notify('bookmark-toggled', { lessonId, isBookmarked: false });
      return false;
    } else {
      await DB.put('bookmarks', {
        id,
        studentId,
        lessonId,
        lessonTitle: lessonTitle || 'درس برمجي',
        createdAt: new Date().toISOString()
      });
      State.notify('bookmark-toggled', { lessonId, isBookmarked: true });
      return true;
    }
  },

  /**
   * Get adjacent lessons (previous and next)
   */
  async getAdjacentLessons(lessonId) {
    const lesson = await this.getLesson(lessonId);
    if (!lesson) return { prev: null, next: null };

    const course = await DB.get('courses', lesson.courseId);
    if (!course || !course.modules) return { prev: null, next: null };

    const allLessonIds = [];
    course.modules.forEach((mod) => {
      if (mod.lessonIds) allLessonIds.push(...mod.lessonIds);
    });

    const currentIndex = allLessonIds.indexOf(lessonId);
    const prevId = currentIndex > 0 ? allLessonIds[currentIndex - 1] : null;
    const nextId = currentIndex >= 0 && currentIndex < allLessonIds.length - 1 ? allLessonIds[currentIndex + 1] : null;

    const [prev, next] = await Promise.all([
      prevId ? this.getLesson(prevId) : null,
      nextId ? this.getLesson(nextId) : null
    ]);

    return { prev, next };
  }
};
