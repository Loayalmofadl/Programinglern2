/**
 * Programming Academy - Progress Calculation Engine
 */

import { DB } from './database.js';
import { State } from './state.js';

export const ProgressEngine = {
  /**
   * Get comprehensive progress statistics for a student
   */
  async getStudentStats(studentId) {
    if (!studentId) {
      return {
        overallPercentage: 0,
        completedLessonsCount: 0,
        totalLessonsCount: 3,
        totalHoursLearned: 0,
        nextLesson: null,
        dailyGoalProgress: 0,
        streakDays: 0,
        points: 0,
        level: 1
      };
    }

    const [allCourses, allProgress, allQuizAttempts, student] = await Promise.all([
      DB.getAll('courses'),
      DB.getAllByIndex('lessonProgress', 'studentId', studentId),
      DB.getAllByIndex('quizAttempts', 'studentId', studentId),
      DB.get('students', studentId)
    ]);

    const completedLessonIds = new Set(
      allProgress.filter((p) => p.isCompleted).map((p) => p.lessonId)
    );

    // Tally all lessons in known courses
    let totalLessonsCount = 0;
    const allLessonList = [];

    for (const course of allCourses) {
      if (course.modules) {
        for (const mod of course.modules) {
          if (mod.lessonIds) {
            for (const lid of mod.lessonIds) {
              totalLessonsCount++;
              allLessonList.push({
                lessonId: lid,
                courseId: course.id,
                courseTitle: course.title
              });
            }
          }
        }
      }
    }

    if (totalLessonsCount === 0) totalLessonsCount = 3; // fallback to sample lessons

    const completedCount = completedLessonIds.size;
    const overallPercentage = Math.round((completedCount / totalLessonsCount) * 100);
    const totalHoursLearned = Math.round(completedCount * 0.75 * 10) / 10;

    // Find next uncompleted lesson
    let nextLesson = null;
    for (const item of allLessonList) {
      if (!completedLessonIds.has(item.lessonId)) {
        const lessonDetail = State.lessonsMap.get(item.lessonId) || (await DB.get('lessons', item.lessonId));
        if (lessonDetail) {
          nextLesson = {
            ...lessonDetail,
            courseTitle: item.courseTitle
          };
          break;
        }
      }
    }

    // Daily goal calculation: lessons or quizzes completed today
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCompleted = allProgress.filter(
      (p) => p.isCompleted && p.completedAt && p.completedAt.startsWith(todayStr)
    ).length;
    const dailyGoalTarget = 1; // 1 lesson a day or 20 mins
    const dailyGoalProgress = Math.min(100, Math.round((todayCompleted / dailyGoalTarget) * 100));

    return {
      overallPercentage,
      completedLessonsCount: completedCount,
      totalLessonsCount,
      totalHoursLearned,
      nextLesson,
      dailyGoalProgress,
      streakDays: student?.streakDays || 1,
      points: student?.points || 0,
      level: student?.level || 1
    };
  }
};
