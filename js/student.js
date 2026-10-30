/**
 * Programming Academy - Student Profile Manager
 */

import { DB } from './database.js';
import { State } from './state.js';

export const StudentManager = {
  /**
   * Create a new student profile
   */
  async createStudent({ name, avatar = 'avatar-1', goal = 'web', dailyGoal = 20 }) {
    const student = {
      id: 'student_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name: name.trim(),
      avatar,
      goal,
      dailyGoal: Number(dailyGoal) || 20,
      points: 0,
      level: 1,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      completedLessonsCount: 0,
      completedCoursesCount: 0
    };

    await DB.put('students', student);
    State.setCurrentStudent(student);
    return student;
  },

  /**
   * Get all registered student profiles
   */
  async getAllStudents() {
    return await DB.getAll('students');
  },

  /**
   * Load active student from storage or auto-select first profile
   */
  async loadActiveStudent() {
    const savedId = localStorage.getItem('programming_academy_active_student_id');
    const allStudents = await this.getAllStudents();

    if (savedId) {
      const found = allStudents.find((s) => s.id === savedId);
      if (found) {
        State.setCurrentStudent(found);
        await this.checkStreak(found);
        return found;
      }
    }

    if (allStudents.length > 0) {
      State.setCurrentStudent(allStudents[0]);
      await this.checkStreak(allStudents[0]);
      return allStudents[0];
    }

    State.setCurrentStudent(null);
    return null;
  },

  /**
   * Switch active student
   */
  async switchStudent(studentId) {
    const student = await DB.get('students', studentId);
    if (student) {
      State.setCurrentStudent(student);
      await this.checkStreak(student);
      return student;
    }
    return null;
  },

  /**
   * Award points to the current student
   */
  async awardPoints(amount, reason = '') {
    if (!State.currentStudent) return;
    const student = State.currentStudent;
    student.points = (student.points || 0) + amount;
    
    // Level up calculation: every 150 points = 1 level
    const newLevel = Math.floor(student.points / 150) + 1;
    student.level = newLevel;

    await DB.put('students', student);
    State.setCurrentStudent(student);
    State.notify('points-awarded', { amount, reason, totalPoints: student.points });
  },

  /**
   * Check and update learning streak
   */
  async checkStreak(student) {
    if (!student) return;
    const today = new Date().toISOString().split('T')[0];
    const lastActive = student.lastActiveDate;

    if (!lastActive) {
      student.lastActiveDate = today;
      student.streakDays = 1;
      await DB.put('students', student);
      return;
    }

    if (lastActive === today) {
      return;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastActive === yesterday) {
      student.streakDays = (student.streakDays || 0) + 1;
    } else {
      student.streakDays = 1;
    }

    student.lastActiveDate = today;
    await DB.put('students', student);
    State.setCurrentStudent(student);
  }
};
