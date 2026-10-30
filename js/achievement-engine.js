/**
 * Programming Academy - Achievement & Certificate Engine
 */

import { DB } from './database.js';
import { State } from './state.js';
import { StudentManager } from './student.js';

export const BADGES_LIST = [
  {
    id: 'badge_first_step',
    title: 'الخطوة الأولى',
    description: 'أكملت أول درس برمجي في الأكاديمية بنجاح.',
    icon: 'sparkles',
    category: 'lessons',
    points: 30
  },
  {
    id: 'badge_quiz_ace',
    title: 'فارس الاختبارات',
    description: 'أحرزت درجة كاملة 100% في اختبار فهم برمجي.',
    icon: 'award',
    category: 'quizzes',
    points: 50
  },
  {
    id: 'badge_code_runner',
    title: 'مستكشف المختبر',
    description: 'قمت بتشغيل واختبار أول مشروع لك في محرر الكود.',
    icon: 'terminal',
    category: 'playground',
    points: 20
  },
  {
    id: 'badge_note_taker',
    title: 'المبرمج المدون',
    description: 'دونت أول ملاحظة دراسية لترسيخ المفاهيم البرمجية.',
    icon: 'edit',
    category: 'notes',
    points: 15
  },
  {
    id: 'badge_course_finisher',
    title: 'بطل الأساسيات',
    description: 'أتممت متطلبات مساق تأسيسي بالكامل.',
    icon: 'trophy',
    category: 'courses',
    points: 100
  }
];

export const AchievementEngine = {
  /**
   * Check and unlock badge for a student
   */
  async checkAndUnlock(studentId, badgeId) {
    if (!studentId) return;
    const key = `${studentId}_${badgeId}`;
    const existing = await DB.get('achievements', key);
    if (existing) return; // already unlocked

    const badgeMeta = BADGES_LIST.find((b) => b.id === badgeId);
    if (!badgeMeta) return;

    const record = {
      id: key,
      studentId,
      badgeId,
      title: badgeMeta.title,
      description: badgeMeta.description,
      unlockedAt: new Date().toISOString()
    };

    await DB.put('achievements', record);
    await StudentManager.awardPoints(badgeMeta.points, `إنجاز: ${badgeMeta.title}`);
    State.notify('achievement-unlocked', badgeMeta);
  },

  /**
   * Get all unlocked achievements for a student
   */
  async getStudentAchievements(studentId) {
    if (!studentId) return [];
    const unlocked = await DB.getAllByIndex('achievements', 'studentId', studentId);
    const unlockedMap = new Map(unlocked.map((u) => [u.badgeId, u]));

    return BADGES_LIST.map((badge) => {
      const isUnlocked = unlockedMap.has(badge.id);
      return {
        ...badge,
        isUnlocked,
        unlockedAt: isUnlocked ? unlockedMap.get(badge.id).unlockedAt : null
      };
    });
  }
};
