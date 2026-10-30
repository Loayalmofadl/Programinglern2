/**
 * Programming Academy - Course & Curriculum Engine
 */

import { DB } from './database.js';
import { State } from './state.js';

export const CourseEngine = {
  /**
   * Initializes curriculum from local JSON or IndexedDB
   */
  async initCurriculum() {
    try {
      // 1. Fetch JSON datasets
      const [curriculumRes, lessonsRes, quizzesRes, exercisesRes] = await Promise.all([
        fetch('/data/sample-curriculum.json'),
        fetch('/data/sample-lessons.json'),
        fetch('/data/sample-quizzes.json'),
        fetch('/data/sample-exercises.json')
      ]);

      const curriculumData = await curriculumRes.json();
      const lessonsData = await lessonsRes.json();
      const quizzesData = await quizzesRes.json();
      const exercisesData = await exercisesRes.json();

      State.curriculum = curriculumData.academicPathway;

      // Map baseline demonstration datasets
      lessonsData.lessons.forEach((l) => State.lessonsMap.set(l.id, l));
      quizzesData.quizzes.forEach((q) => State.quizzesMap.set(q.id, q));
      exercisesData.exercises.forEach((e) => State.exercisesMap.set(e.id, e));

      // Load Course 01: Programming Foundations - Level 1 (Full 17 Lessons, Quizzes, Exercises & Capstone)
      const PF1_LESSONS = [
        'PF1-L01', 'PF1-L02', 'PF1-L03', 'PF1-L04', 'PF1-L05',
        'PF1-L06', 'PF1-L07', 'PF1-L08', 'PF1-L09', 'PF1-L10',
        'PF1-L11', 'PF1-L12', 'PF1-L13', 'PF1-L14', 'PF1-L15',
        'PF1-L16', 'PF1-L17'
      ];

      const PF1_QUIZZES = [
        'quiz-pf1-l01', 'quiz-pf1-l02', 'quiz-pf1-l03', 'quiz-pf1-l04', 'quiz-pf1-l05',
        'quiz-pf1-l06', 'quiz-pf1-l07', 'quiz-pf1-l08', 'quiz-pf1-l09', 'quiz-pf1-l10',
        'quiz-pf1-l11', 'quiz-pf1-l12', 'quiz-pf1-l13', 'quiz-pf1-l14', 'quiz-pf1-l15',
        'quiz-pf1-l16', 'quiz-pf1-l17',
        'quiz-pf1-cum1', 'quiz-pf1-cum2', 'quiz-pf1-cum3', 'quiz-pf1-final'
      ];

      const PF1_EXERCISES = [
        'exercise-pf1-l01', 'exercise-pf1-l02', 'exercise-pf1-l03', 'exercise-pf1-l04', 'exercise-pf1-l05',
        'exercise-pf1-l06', 'exercise-pf1-l07', 'exercise-pf1-l08', 'exercise-pf1-l09', 'exercise-pf1-l10',
        'exercise-pf1-l11', 'exercise-pf1-l12', 'exercise-pf1-l13', 'exercise-pf1-l14', 'exercise-pf1-l15',
        'exercise-pf1-l16', 'exercise-pf1-l17'
      ];

      await Promise.allSettled([
        // 17 Comprehensive Lessons
        ...PF1_LESSONS.map(async (lid) => {
          try {
            const r = await fetch(`/content/programming-foundations-level-1/lessons/${lid}.json`);
            if (r.ok) {
              const lesson = await r.json();
              State.lessonsMap.set(lesson.id, lesson);
              await DB.put('lessons', lesson);
            }
          } catch (err) {
            console.warn(`[CourseEngine] Offline or missing lesson ${lid}:`, err);
          }
        }),

        // 21 Quizzes (17 lessons + 3 cumulative + 1 final exam)
        ...PF1_QUIZZES.map(async (qid) => {
          try {
            const r = await fetch(`/content/programming-foundations-level-1/quizzes/${qid}.json`);
            if (r.ok) {
              const quiz = await r.json();
              State.quizzesMap.set(quiz.id, quiz);
            }
          } catch (err) {
            console.warn(`[CourseEngine] Offline or missing quiz ${qid}:`, err);
          }
        }),

        // 17 Interactive Exercises
        ...PF1_EXERCISES.map(async (eid) => {
          try {
            const r = await fetch(`/content/programming-foundations-level-1/exercises/${eid}.json`);
            if (r.ok) {
              const ex = await r.json();
              State.exercisesMap.set(ex.id, ex);
            }
          } catch (err) {
            console.warn(`[CourseEngine] Offline or missing exercise ${eid}:`, err);
          }
        }),

        // Capstone Challenge Project
        (async () => {
          try {
            const r = await fetch('/content/programming-foundations-level-1/projects/capstone-challenge.json');
            if (r.ok) {
              const proj = await r.json();
              State.projectsMap.set(proj.id, proj);
            }
          } catch (err) {
            console.warn('[CourseEngine] Capstone project fetch warning:', err);
          }
        })()
      ]);

      // Persist courses and lessons to IndexedDB for offline resilience
      for (const year of curriculumData.academicPathway.years) {
        for (const semester of year.semesters) {
          for (const course of semester.courses) {
            course.semesterId = semester.id;
            course.yearId = year.id;
            await DB.put('courses', course);

            if (course.modules) {
              for (const mod of course.modules) {
                mod.courseId = course.id;
                await DB.put('modules', mod);
              }
            }
          }
        }
      }

      for (const lesson of lessonsData.lessons) {
        await DB.put('lessons', lesson);
      }

      console.log('Curriculum and educational dataset initialized successfully.');
      return State.curriculum;
    } catch (err) {
      console.warn('Network fetch failed, attempting to read from IndexedDB:', err);
      // Fallback: Read from IndexedDB
      const cachedCourses = await DB.getAll('courses');
      const cachedLessons = await DB.getAll('lessons');
      cachedLessons.forEach((l) => State.lessonsMap.set(l.id, l));
      return { years: [] };
    }
  },

  /**
   * Get all courses with their dynamic progress and locked/unlocked state
   */
  async getCoursesWithStatus(studentId) {
    const allCourses = await DB.getAll('courses');
    const studentProgress = studentId ? await DB.getAllByIndex('lessonProgress', 'studentId', studentId) : [];
    const completedLessonIds = new Set(
      studentProgress.filter((p) => p.isCompleted).map((p) => p.lessonId)
    );

    return allCourses.map((course) => {
      let totalLessons = 0;
      let completedLessons = 0;

      if (course.modules && course.modules.length > 0) {
        course.modules.forEach((mod) => {
          if (mod.lessonIds) {
            totalLessons += mod.lessonIds.length;
            mod.lessonIds.forEach((lid) => {
              if (completedLessonIds.has(lid)) completedLessons++;
            });
          }
        });
      }

      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      const isCompleted = totalLessons > 0 && completedLessons === totalLessons;

      // Prerequisites check
      let isUnlocked = true;
      if (course.prerequisites && course.prerequisites.length > 0) {
        // If prerequisites exist, check if student completed each prereq course
        // For demonstration, CS101 unlocks WEB101 if CS101 has progress or completed
        isUnlocked = course.status !== 'locked';
      } else if (course.status === 'locked') {
        isUnlocked = false;
      }

      return {
        ...course,
        totalLessons,
        completedLessons,
        progressPercent,
        isCompleted,
        isUnlocked
      };
    });
  },

  /**
   * Get a single course with enriched modules and lesson statuses
   */
  async getCourseDetails(courseId, studentId) {
    const course = await DB.get('courses', courseId);
    if (!course) return null;

    const studentProgress = studentId ? await DB.getAllByIndex('lessonProgress', 'studentId', studentId) : [];
    const completedLessonIds = new Set(
      studentProgress.filter((p) => p.isCompleted).map((p) => p.lessonId)
    );

    let totalLessons = 0;
    let completedLessons = 0;

    const enrichedModules = (course.modules || []).map((mod) => {
      const lessons = (mod.lessonIds || []).map((lid) => {
        const lessonData = State.lessonsMap.get(lid) || { id: lid, title: 'درس برمجي' };
        const isCompleted = completedLessonIds.has(lid);
        totalLessons++;
        if (isCompleted) completedLessons++;
        return {
          ...lessonData,
          isCompleted
        };
      });

      return {
        ...mod,
        lessons
      };
    });

    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      ...course,
      modules: enrichedModules,
      totalLessons,
      completedLessons,
      progressPercent,
      isCompleted: totalLessons > 0 && completedLessons === totalLessons
    };
  }
};
