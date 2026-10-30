/**
 * Programming Academy - Main Application Orchestrator
 * Pure Vanilla JavaScript ES6+ Architecture
 */

import { DB } from './database.js';
import { State } from './state.js';
import { StudentManager } from './student.js';
import { CourseEngine } from './course-engine.js';
import { LessonEngine } from './lesson-engine.js';
import { QuizEngine } from './quiz-engine.js';
import { ExerciseEngine } from './exercise-engine.js';
import { ProgressEngine } from './progress-engine.js';
import { AchievementEngine } from './achievement-engine.js';
import { NotesEngine } from './notes-engine.js';
import { BackupEngine } from './backup-engine.js';
import { OfflineManager } from './offline-manager.js';
import { EditorEngine } from './editor.js';
import { Router } from './router.js';

// SVG Icon Helpers
const ICONS = {
  home: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
  book: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`,
  terminal: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  award: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>`,
  settings: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  check: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
  bookmark: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>`,
  copy: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`,
  play: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  lock: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`,
  sparkles: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`,
  download: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>`,
  upload: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>`
};

export const App = {
  async init() {
    console.log('Initializing Programming Academy Application...');

    // 1. Initialize IndexedDB
    await DB.init();

    // 2. Load cached settings (theme, font size)
    const savedTheme = localStorage.getItem('programming_academy_theme') || 'dark';
    State.setTheme(savedTheme);

    const savedFontSize = localStorage.getItem('programming_academy_font_size') || 'normal';
    State.setFontSize(savedFontSize);

    // 3. Load or select active student profile
    await StudentManager.loadActiveStudent();

    // 4. Initialize Curriculum dataset
    await CourseEngine.initCurriculum();

    // 5. Initialize Offline Manager & Service Worker
    await OfflineManager.init();

    // 6. Bind Global DOM Events (Navigation, Mobile Drawer, Modals)
    this.bindGlobalEvents();

    // 7. Initialize SPA Router
    Router.init({
      welcome: () => this.renderWelcomeScreen(),
      dashboard: () => this.renderDashboard(),
      curriculum: (params) => this.renderCurriculum(params),
      course: (params) => this.renderCourseDetails(params.id),
      lesson: (params) => this.renderLesson(params.id),
      quiz: (params) => this.renderQuiz(params.id),
      exercise: (params) => this.renderExercise(params.id),
      playground: (params) => this.renderPlayground(params),
      calculator: () => this.renderCalculatorScreen(),
      project: (params) => this.renderCapstoneProject(params.id),
      achievements: () => this.renderAchievements(),
      notes: () => this.renderNotesAndBookmarks(),
      settings: () => this.renderSettings()
    });

    // 8. Subscribe to State changes
    State.subscribe((event, data) => {
      this.handleStateChange(event, data);
    });
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  },

  handleStateChange(event, data) {
    if (event === 'student-changed') {
      this.updateHeaderStudentUI();
      if (!data) {
        Router.navigate('#welcome');
      }
    } else if (event === 'points-awarded') {
      this.showToast(`+${data.amount} نقطة XP: ${data.reason}`, 'success');
      this.updateHeaderStudentUI();
    } else if (event === 'achievement-unlocked') {
      this.showToast(`🏆 إنجاز جديد: ${data.title}!`, 'success');
    }
  },

  updateHeaderStudentUI() {
    const nameEl = document.getElementById('header-student-name');
    const pointsEl = document.getElementById('header-student-points');
    const avatarEl = document.getElementById('header-student-avatar');

    if (State.currentStudent) {
      if (nameEl) nameEl.textContent = State.currentStudent.name;
      if (pointsEl) pointsEl.textContent = `${State.currentStudent.points || 0} XP`;
      if (avatarEl) avatarEl.textContent = State.currentStudent.name.charAt(0).toUpperCase();
    } else {
      if (nameEl) nameEl.textContent = 'زائر';
      if (pointsEl) pointsEl.textContent = '0 XP';
      if (avatarEl) avatarEl.textContent = '؟';
    }
  },

  bindGlobalEvents() {
    // Mobile Sidebar Drawer Toggle
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.app-sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });

      // Close sidebar when clicking links inside
      sidebar.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          sidebar.classList.remove('mobile-open');
        });
      });
    }

    // Modal close triggers
    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    // PWA Install trigger buttons
    document.querySelectorAll('.pwa-install-trigger').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const res = await OfflineManager.promptInstall();
        if (res === 'ios-guide') {
          alert('لتثبيت التطبيق على آيفون:\n1. اضغط زر المشاركة (Share) في أسفل متصفح Safari\n2. اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen)');
        }
      });
    });
  },

  /* ========================================================
     SCREEN A: WELCOME SCREEN (شاشة الترحيب واختيار الحساب)
  ======================================================== */
  async renderWelcomeScreen() {
    const main = document.getElementById('app-main-viewport');
    const allStudents = await StudentManager.getAllStudents();

    main.innerHTML = `
      <div class="welcome-container" style="max-width: 640px; margin: 40px auto; text-align: center;">
        <div style="margin-bottom: var(--space-6);">
          <img src="/src/assets/images/academy_brand_mark_1793385951484.jpg" 
               alt="أكاديمية البرمجة" 
               style="width: 110px; height: 110px; border-radius: var(--radius-xl); box-shadow: var(--shadow-glow); margin-bottom: var(--space-4);" />
          <h1 style="font-size: var(--text-3xl); font-weight: 800; color: #FFFFFF; margin-bottom: var(--space-2);">
            أكاديمية البرمجة
          </h1>
          <p style="font-size: var(--text-base); color: var(--text-secondary); line-height: 1.6;">
            منصة تعليمية تفاعلية شاملة باللغة العربية تمتد لعامين لنقلك من الصفر إلى الاحتراف. تعمل بكفاءة 100% دون اتصال بالإنترنت (Offline-First).
          </p>
        </div>

        ${allStudents.length > 0 ? `
          <div class="card" style="margin-bottom: var(--space-6); padding: var(--space-6); text-align: right;">
            <h3 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-4);">
              متابعة التعلم بحساب موجود
            </h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              ${allStudents.map(s => `
                <div class="lesson-row" style="cursor: pointer;" data-select-student="${s.id}">
                  <div class="lesson-row-left">
                    <div class="stat-icon-wrapper stat-icon-blue" style="width: 40px; height: 40px;">
                      ${s.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style="font-weight: 700; color: var(--text-primary);">${s.name}</div>
                      <div style="font-size: var(--text-xs); color: var(--text-muted);">${s.points || 0} نقطة XP · المستوى ${s.level || 1}</div>
                    </div>
                  </div>
                  <button class="btn btn-secondary btn-sm">دخول</button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="card" style="padding: var(--space-6); text-align: right;">
          <h3 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-4);">
            ${allStudents.length > 0 ? 'إنشاء ملف طالب جديد' : 'ابدأ رحلتك التعليمية الآن'}
          </h3>
          <form id="create-student-form" style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div>
              <label class="form-label" style="display: block; font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">اسم الطالب / اللقب</label>
              <input type="text" id="student-name-input" placeholder="مثال: أحمد محمد" required autofocus />
            </div>

            <div>
              <label class="form-label" style="display: block; font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">المسار الأكاديمي المفضل</label>
              <select id="student-goal-input">
                <option value="fullstack">مسار الويب الشامل والواجهات (موصى به للمبتدئين)</option>
                <option value="cs">أساسيات علوم الحاسب والتفكير المنطقي</option>
                <option value="mobile">تطبيقات الهواتف الذكية عبر الويب</option>
              </select>
            </div>

            <div>
              <label class="form-label" style="display: block; font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">الهدف اليومي المخصص</label>
              <select id="student-daily-goal">
                <option value="15">15 دقيقة يومياً (وتيرة هادئة)</option>
                <option value="30" selected>30 دقيقة يومياً (وتيرة متوازنة)</option>
                <option value="60">60 دقيقة يومياً (وتيرة مكثفة)</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="margin-top: var(--space-2); width: 100%;">
              إنشاء الملف والبدء في الدراسة
            </button>
          </form>
        </div>
      </div>
    `;

    // Event handlers for student selection
    main.querySelectorAll('[data-select-student]').forEach((row) => {
      row.addEventListener('click', async () => {
        const id = row.getAttribute('data-select-student');
        await StudentManager.switchStudent(id);
        this.showToast('أهلاً بعودتك مجدداً!', 'success');
        Router.navigate('#dashboard');
      });
    });

    // Event handler for student creation
    const form = document.getElementById('create-student-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('student-name-input').value;
        const goal = document.getElementById('student-goal-input').value;
        const dailyGoal = document.getElementById('student-daily-goal').value;

        if (name.trim()) {
          await StudentManager.createStudent({ name, goal, dailyGoal });
          this.showToast(`مرحباً بك يا ${name} في أكاديمية البرمجة!`, 'success');
          Router.navigate('#dashboard');
        }
      });
    }
  },

  /* ========================================================
     SCREEN B: STUDENT DASHBOARD (لوحة تحكم الطالب)
  ======================================================== */
  async renderDashboard() {
    const main = document.getElementById('app-main-viewport');
    if (!State.currentStudent) {
      Router.navigate('#welcome');
      return;
    }

    const student = State.currentStudent;
    const stats = await ProgressEngine.getStudentStats(student.id);
    const recentNotes = await NotesEngine.getNotes(student.id);

    main.innerHTML = `
      <!-- Welcome Hero Banner -->
      <div class="dashboard-hero">
        <img src="/src/assets/images/hero_programming_academy_1793385952805.jpg" class="dashboard-hero-bg" alt="بيئة الأكاديمية" />
        <div class="dashboard-hero-content">
          <div class="hero-welcome-badge">
            ${ICONS.sparkles}
            <span>مرحباً بعودتك يا ${student.name}</span>
          </div>
          <h1 class="hero-title">
            واصل بناء مستقبلك البرمجي خطوة بخطوة
          </h1>
          <p class="hero-subtitle">
            أنت مسجل في مسار السنة الأولى. تعلمت حتى الآن ${stats.totalHoursLearned} ساعة وأنجزت ${stats.completedLessonsCount} من ${stats.totalLessonsCount} درس.
          </p>
          <div class="hero-actions">
            ${stats.nextLesson ? `
              <a href="#lesson/${stats.nextLesson.id}" class="btn btn-primary btn-lg">
                ${ICONS.play}
                <span>متابعة الدرس القادم: ${stats.nextLesson.title}</span>
              </a>
            ` : `
              <a href="#curriculum" class="btn btn-primary btn-lg">
                ${ICONS.book}
                <span>استعراض المنهج الدراسي</span>
              </a>
            `}
            <a href="#playground" class="btn btn-secondary btn-lg">
              ${ICONS.terminal}
              <span>مختبر البرمجة المفتوح</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Stats Metrics Strip -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-blue">
            ${ICONS.award}
          </div>
          <div class="stat-info">
            <div class="stat-value">${student.points || 0}</div>
            <div class="stat-label">نقاط الخبرة (XP) · مستوى ${student.level || 1}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-indigo">
            ${ICONS.book}
          </div>
          <div class="stat-info">
            <div class="stat-value">${stats.completedLessonsCount} / ${stats.totalLessonsCount}</div>
            <div class="stat-label">الدروس البرمجية المكتملة</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-amber">
            ${ICONS.sparkles}
          </div>
          <div class="stat-info">
            <div class="stat-value">${student.streakDays || 1} يوم</div>
            <div class="stat-label">أيام الالتزام المتتالية</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-violet">
            ${ICONS.terminal}
          </div>
          <div class="stat-info">
            <div class="stat-value">${stats.overallPercentage}%</div>
            <div class="stat-label">إجمالي إنجاز المسار</div>
          </div>
        </div>
      </div>

      <!-- 2-Column Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Main Column: Next Step & Pathway -->
        <div style="display: flex; flex-direction: column; gap: var(--space-6);">
          ${stats.nextLesson ? `
            <div class="continue-card">
              <div class="continue-card-header">
                <span class="continue-tag">${stats.nextLesson.courseTitle || 'مساق أساسي'}</span>
                <span style="font-size: var(--text-xs); color: var(--text-muted);">${stats.nextLesson.durationMinutes || 20} دقيقة</span>
              </div>
              <h2 class="continue-title">${stats.nextLesson.title}</h2>
              <p class="continue-desc">
                ${stats.nextLesson.objectives ? stats.nextLesson.objectives[0] : 'تعلم مفاهيم برمجية تفاعلية واكتب كودك الأول.'}
              </p>
              <div style="display: flex; gap: var(--space-3); margin-top: var(--space-2);">
                <a href="#lesson/${stats.nextLesson.id}" class="btn btn-primary">
                  بدء الدرس الآن
                </a>
                <a href="#course/${stats.nextLesson.courseId}" class="btn btn-outline">
                  استعراض تفاصيل المساق
                </a>
              </div>
            </div>
          ` : `
            <div class="continue-card">
              <h2 class="continue-title">🎉 أحسنت! لقد أكملت جميع الدروس الحالية بنجاح</h2>
              <p class="continue-desc">يمكنك التدرب الحر في مختبر الأكواد أو مراجعة الاختبارات السابقة.</p>
              <a href="#playground" class="btn btn-primary">فتح مختبر البرمجة</a>
            </div>
          `}

          <!-- Quick Navigation Cards -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <a href="#curriculum" class="card card-clickable" style="padding: var(--space-5);">
              <div style="color: var(--accent-blue); margin-bottom: var(--space-2);">${ICONS.book}</div>
              <div style="font-weight: 700; margin-bottom: var(--space-1);">المسار الأكاديمي</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted);">تصفح الفصول الثمانية والمناهج</div>
            </a>

            <a href="#notes" class="card card-clickable" style="padding: var(--space-5);">
              <div style="color: var(--accent-indigo); margin-bottom: var(--space-2);">${ICONS.bookmark}</div>
              <div style="font-weight: 700; margin-bottom: var(--space-1);">الملاحظات والإشارات</div>
              <div style="font-size: var(--text-xs); color: var(--text-muted);">${recentNotes.length} ملاحظة مدونة</div>
            </a>
          </div>
        </div>

        <!-- Sidebar Column: Daily Goal & Achievements -->
        <div style="display: flex; flex-direction: column; gap: var(--space-6);">
          <!-- Daily Goal Widget -->
          <div class="goal-widget">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="font-size: var(--text-base); font-weight: 700;">الهدف اليومي</h3>
              <span style="font-size: var(--text-xs); color: var(--text-muted);">${student.dailyGoal || 20} دقيقة</span>
            </div>

            <div class="goal-circle-wrapper">
              <div class="goal-circle">
                <svg viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#38BDF8"/>
                      <stop offset="100%" stop-color="#8B5CF6"/>
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="42" class="goal-circle-bg"/>
                  <circle cx="50" cy="50" r="42" class="goal-circle-bar"
                          stroke-dasharray="264"
                          stroke-dashoffset="${264 - (264 * stats.dailyGoalProgress) / 100}"/>
                </svg>
                <div class="goal-circle-text">
                  <span class="goal-circle-number">${stats.dailyGoalProgress}%</span>
                  <span class="goal-circle-sub">مكتمل</span>
                </div>
              </div>
            </div>

            <p style="font-size: var(--text-xs); color: var(--text-secondary); text-align: center; margin: 0;">
              ${stats.dailyGoalProgress >= 100 ? 'رائع! حققت هدفك اليومي بنجاح 🎯' : 'أكمل درساً أو اختباراً واحداً لإتمام هدف اليوم.'}
            </p>
          </div>

          <!-- Offline Status Indicator Card -->
          <div class="card" style="padding: var(--space-5);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2);">
              <span style="font-weight: 700; font-size: var(--text-sm);">حالة النظام المحلي</span>
              <span class="online-pill" style="font-size: 11px;">Offline Ready</span>
            </div>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0;">
              جميع ملفات المنصة ومحرر CodeMirror مخزنة في جهازك عبر IndexedDB و Service Worker.
            </p>
          </div>
        </div>
      </div>
    `;
  },

  /* ========================================================
     SCREEN C: CURRICULUM SCREEN (المسار الأكاديمي والمناهج)
  ======================================================== */
  async renderCurriculum() {
    const main = document.getElementById('app-main-viewport');
    const student = State.currentStudent;
    const coursesWithStatus = await CourseEngine.getCoursesWithStatus(student ? student.id : null);
    const curriculum = State.curriculum || { years: [] };

    // Default to Year 1
    let activeYearNumber = 1;

    const renderCurriculumContent = () => {
      const year = curriculum.years.find((y) => y.number === activeYearNumber) || curriculum.years[0];

      main.innerHTML = `
        <div class="curriculum-header">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-4); margin-bottom: var(--space-4);">
            <div>
              <h1 style="font-size: var(--text-2xl); font-weight: 800; margin-bottom: var(--space-1);">
                المسار الأكاديمي الشامل (سنتان)
              </h1>
              <p style="font-size: var(--text-sm); color: var(--text-secondary);">
                8 فصول دراسية مقسمة وفق معايير برمجية عالمية من الأساسيات حتى بناء الأنظمة الكاملة.
              </p>
            </div>
            <div class="callout callout-info" style="margin: 0; padding: var(--space-2) var(--space-4);">
              <span style="font-size: var(--text-xs); font-weight: 600;">بيانات توضيحية تجريبية (Demonstration Data)</span>
            </div>
          </div>

          <!-- Academic Year Tabs -->
          <div class="year-tabs">
            <button class="year-tab-btn ${activeYearNumber === 1 ? 'active' : ''}" data-year="1">
              السنة الأولى: الأساسيات وتطوير الويب
            </button>
            <button class="year-tab-btn ${activeYearNumber === 2 ? 'active' : ''}" data-year="2">
              السنة الثانية: البرمجة المتقدمة والمشاريع
            </button>
          </div>
        </div>

        <!-- Semesters in this Year -->
        <div class="semesters-list">
          ${(year?.semesters || []).map((sem) => {
            const semCourses = coursesWithStatus.filter(c => c.semesterId === sem.id) || [];
            return `
              <div class="semester-container">
                <div class="semester-header">
                  <div class="semester-title">
                    <span>${sem.title}</span>
                  </div>
                  <span class="semester-badge">الفصل الدراسي ${sem.number}</span>
                </div>

                <div class="courses-grid">
                  ${semCourses.map((c) => `
                    <div class="course-card ${!c.isUnlocked ? 'locked' : ''}" 
                         ${c.isUnlocked ? `onclick="window.location.hash='#course/${c.id}'"` : ''} 
                         style="${c.isUnlocked ? 'cursor: pointer;' : 'cursor: not-allowed;'}">
                      <div class="course-card-top">
                        <span class="course-code-tag">${c.code}</span>
                        <div class="course-icon-badge">
                          ${!c.isUnlocked ? ICONS.lock : (c.isCompleted ? ICONS.check : ICONS.book)}
                        </div>
                      </div>

                      <div>
                        <h3 class="course-title">${c.title}</h3>
                        <p class="course-desc">${c.shortDescription || c.description}</p>
                      </div>

                      <div>
                        <div class="progress-container" style="margin-bottom: var(--space-3);">
                          <div class="progress-header">
                            <span>نسبة الإنجاز</span>
                            <span>${c.progressPercent}%</span>
                          </div>
                          <div class="progress-bar">
                            <div class="progress-fill" style="width: ${c.progressPercent}%;"></div>
                          </div>
                        </div>

                        <div class="meta-row">
                          <span>${c.difficulty || 'مبتدئ'}</span>
                          <span class="meta-separator">·</span>
                          <span>${c.durationHours || 24} ساعة تدريبية</span>
                          <span class="meta-separator">·</span>
                          <span>${c.isUnlocked ? (c.isCompleted ? 'مكتمل ✅' : 'متاح للدراسة') : 'يتطلب متطلبات سابقة 🔒'}</span>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      // Year tab switcher
      main.querySelectorAll('[data-year]').forEach((btn) => {
        btn.addEventListener('click', () => {
          activeYearNumber = Number(btn.getAttribute('data-year'));
          renderCurriculumContent();
        });
      });
    };

    renderCurriculumContent();
  },

  /* ========================================================
     SCREEN D: COURSE DETAILS SCREEN (تفاصيل المساق)
  ======================================================== */
  async renderCourseDetails(courseId) {
    const main = document.getElementById('app-main-viewport');
    const student = State.currentStudent;
    const course = await CourseEngine.getCourseDetails(courseId, student ? student.id : null);

    if (!course) {
      main.innerHTML = `
        <div class="card" style="padding: var(--space-8); text-align: center;">
          <h2>المساق غير موجود</h2>
          <a href="#curriculum" class="btn btn-primary" style="margin-top: var(--space-4);">العودة إلى المناهج</a>
        </div>
      `;
      return;
    }

    main.innerHTML = `
      <div class="course-details-view">
        <div class="breadcrumb-nav">
          <a href="#curriculum">المناهج الدراسية</a>
          <span>/</span>
          <span style="color: var(--text-primary);">${course.title}</span>
        </div>

        <!-- Course Hero Banner -->
        <div class="course-hero-banner">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-4);">
            <div>
              <span class="course-code-tag" style="font-size: var(--text-sm);">${course.code}</span>
              <h1 style="font-size: var(--text-2xl); font-weight: 800; margin: var(--space-2) 0;">${course.title}</h1>
              <p style="font-size: var(--text-base); color: var(--text-secondary); max-width: 700px; line-height: 1.6;">
                ${course.description}
              </p>
            </div>
            
            <div style="text-align: left; background: var(--bg-surface); padding: var(--space-4) var(--space-6); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
              <div style="font-size: var(--text-xs); color: var(--text-muted);">إنجاز المساق</div>
              <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--accent-blue);">${course.progressPercent}%</div>
              <div style="font-size: var(--text-xs); color: var(--text-secondary);">${course.completedLessons} من ${course.totalLessons} درس</div>
            </div>
          </div>

          <!-- Objectives -->
          ${course.objectives && course.objectives.length > 0 ? `
            <div style="margin-top: var(--space-3); border-top: 1px solid var(--border-subtle); padding-top: var(--space-4);">
              <h4 style="font-size: var(--text-sm); font-weight: 700; color: var(--accent-indigo); margin-bottom: var(--space-2);">أهداف ومخرجات التعلم:</h4>
              <ul style="list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-2);">
                ${course.objectives.map(obj => `
                  <li style="font-size: var(--text-xs); color: var(--text-secondary); display: flex; align-items: center; gap: var(--space-2);">
                    <span style="color: var(--accent-blue);">✓</span> ${obj}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Modules & Lessons List -->
        <div>
          <h2 style="font-size: var(--text-lg); font-weight: 700; margin-bottom: var(--space-4);">الوحدات والدروس التعليمية</h2>
          <div class="modules-list">
            ${(course.modules || []).map((mod, idx) => `
              <div class="module-card">
                <div class="module-header">
                  <div>
                    <h3 style="font-size: var(--text-base); font-weight: 700;">${mod.title}</h3>
                    <p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0;">${mod.description || ''}</p>
                  </div>
                  <span style="font-size: var(--text-xs); color: var(--text-muted);">${mod.lessons ? mod.lessons.length : 0} دروس</span>
                </div>

                <div class="module-lessons-container">
                  ${(mod.lessons || []).map(l => `
                    <div class="lesson-row" onclick="window.location.hash='#lesson/${l.id}'">
                      <div class="lesson-row-left">
                        <div class="lesson-status-icon ${l.isCompleted ? 'status-completed' : 'status-in-progress'}">
                          ${l.isCompleted ? '✓' : '▶'}
                        </div>
                        <div>
                          <span style="font-weight: 600; color: var(--text-primary);">${l.title}</span>
                        </div>
                      </div>
                      <div class="meta-row">
                        <span>${l.durationMinutes || 20} دقيقة</span>
                        <span class="meta-separator">·</span>
                        <span style="color: ${l.isCompleted ? 'var(--status-success)' : 'var(--accent-blue)'};">
                          ${l.isCompleted ? 'مكتمل' : 'بدء الدرس'}
                        </span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Cumulative Assessments Section -->
        ${course.cumulativeAssessments && course.cumulativeAssessments.length > 0 ? `
          <div style="margin-top: var(--space-8);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-2);">
              <h2 style="font-size: var(--text-lg); font-weight: 700;">الاختبارات التجميعية والامتحان النهائي</h2>
              <span style="font-size: var(--text-xs); color: var(--accent-indigo); font-weight: 600;">تقييمات مرحلية تقيس الفهم العميق</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4);">
              ${course.cumulativeAssessments.map((ca, idx) => `
                <div class="card" style="padding: var(--space-5); display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-2);">
                      <span class="badge ${ca.id === 'quiz-pf1-final' ? 'badge-primary' : 'badge-secondary'}" style="font-size: 11px;">
                        ${ca.id === 'quiz-pf1-final' ? 'الامتحان النهائي الشامل' : `اختبار تجميعي ${idx + 1}`}
                      </span>
                      <span style="font-size: var(--text-xs); color: var(--text-muted);">درجة النجاح: ${ca.passingScore}%</span>
                    </div>
                    <h3 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-2);">${ca.title}</h3>
                    <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.5; margin-bottom: var(--space-4);">${ca.scope}</p>
                  </div>
                  <a href="#quiz/${ca.id}" class="btn ${ca.id === 'quiz-pf1-final' ? 'btn-primary' : 'btn-outline'} btn-sm" style="width: 100%; text-align: center;">
                    ${ca.id === 'quiz-pf1-final' ? 'بدء الامتحان النهائي 🏆' : 'بدء الاختبار التجميعي'}
                  </a>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Capstone Challenge Project Card -->
        ${course.capstoneProject ? `
          <div class="card" style="margin-top: var(--space-8); padding: var(--space-6); background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%); border: 1px solid rgba(99, 102, 241, 0.3);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-4);">
              <div style="max-width: 680px;">
                <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
                  <span class="badge badge-accent" style="font-size: 11px;">المشروع التطبيقي الختامي (Capstone Project)</span>
                  <span style="font-size: var(--text-xs); color: var(--accent-blue); font-weight: 600;">11 مهمة تطبيقية شاملة</span>
                </div>
                <h3 style="font-size: var(--text-xl); font-weight: 800; color: #FFFFFF; margin-bottom: var(--space-2);">
                  ${course.capstoneProject.title}
                </h3>
                <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6; margin: 0;">
                  ${course.capstoneProject.description}
                </p>
              </div>
              <div style="align-self: center;">
                <a href="#project/${course.capstoneProject.id}" class="btn btn-primary btn-lg" style="gap: var(--space-2);">
                  <span>بدء التحدي الشامل</span>
                  <span>🚀</span>
                </a>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Course Tools & Next Steps -->
        <div style="margin-top: var(--space-8); display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-4);">
          <!-- Programmer Calculator Tool Card -->
          <div class="card" style="padding: var(--space-6); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
                <span class="stat-icon-wrapper stat-icon-cyan" style="width: 36px; height: 36px;">🧮</span>
                <h3 style="font-size: var(--text-base); font-weight: 700;">آلة حاسبة المبرمج التفاعلية</h3>
              </div>
              <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-4);">
                أداة متطورة للتحويل الفوري بين الأنظمة الأربعة (HEX, DEC, OCT, BIN)، وتبديل البتات باللمس المباشر، وتطبيق العمليات المنطقية AND, OR, XOR, NOT والإزاحة.
              </p>
            </div>
            <a href="#calculator" class="btn btn-secondary btn-sm" style="width: 100%; text-align: center;">
              فتح آلة حاسبة المبرمج
            </a>
          </div>

          <!-- Roadmap Card -->
          <div class="card" style="padding: var(--space-6); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
                <span class="stat-icon-wrapper stat-icon-amber" style="width: 36px; height: 36px;">🗺️</span>
                <h3 style="font-size: var(--text-base); font-weight: 700;">الخاتمة والتوجيه للخطوة القادمة</h3>
              </div>
              <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-4);">
                بعد إتمامك لمساق أساسيات البرمجة (Level 1) واجتياز الامتحان النهائي وتحدي Capstone، ستكون مؤهلاً بالكامل للانتقال إلى دورة الخوارزميات وحل المشكلات (Level 2).
              </p>
            </div>
            <a href="#curriculum" class="btn btn-outline btn-sm" style="width: 100%; text-align: center;">
              استعراض المنهج الشامل
            </a>
          </div>
        </div>
      </div>
    `;
  },

  /* ========================================================
     SCREEN E: LESSON SCREEN (شاشة الدرس التفاعلي والمحتوى)
  ======================================================== */
  async renderLesson(lessonId) {
    const main = document.getElementById('app-main-viewport');
    const student = State.currentStudent;
    const lesson = await LessonEngine.getLesson(lessonId);

    if (!lesson) {
      main.innerHTML = `<div class="card" style="padding: var(--space-8); text-align: center;"><h2>الدرس غير موجود</h2><a href="#curriculum" class="btn btn-primary">العودة للمنهج</a></div>`;
      return;
    }

    const [progress, isBookmarked, adjacent] = await Promise.all([
      student ? LessonEngine.getLessonProgress(student.id, lessonId) : { isCompleted: false },
      student ? LessonEngine.isBookmarked(student.id, lessonId) : false,
      LessonEngine.getAdjacentLessons(lessonId)
    ]);

    const lessonNotes = student ? await NotesEngine.getNotes(student.id) : [];
    const thisLessonNotes = lessonNotes.filter(n => n.lessonId === lessonId);

    main.innerHTML = `
      <div class="lesson-container">
        <!-- Top Action Bar -->
        <div class="lesson-top-bar">
          <div class="breadcrumb-nav">
            <a href="#curriculum">المناهج</a>
            <span>/</span>
            <a href="#course/${lesson.courseId}">المساق</a>
            <span>/</span>
            <span style="color: var(--text-primary);">${lesson.title}</span>
          </div>

          <div class="lesson-actions">
            <button id="bookmark-btn" class="btn btn-secondary btn-sm" title="حفظ في المفضلة">
              ${ICONS.bookmark}
              <span>${isBookmarked ? 'محفوظ في المفضلة' : 'حفظ كإشارة'}</span>
            </button>
            <button id="toggle-complete-btn" class="btn ${progress.isCompleted ? 'btn-secondary' : 'btn-primary'} btn-sm">
              ${ICONS.check}
              <span>${progress.isCompleted ? 'مكتمل (اضغط للتراجع)' : 'تحديد كمكتمل (+25 XP)'}</span>
            </button>
          </div>
        </div>

        <!-- Title & Objectives Box -->
        <div class="lesson-title-area">
          <h1 class="lesson-main-title">${lesson.title}</h1>
          <div class="meta-row">
            <span>المدة التقديرية: ${lesson.durationMinutes || 20} دقيقة</span>
            <span class="meta-separator">·</span>
            <span>الحالة: ${progress.isCompleted ? 'تم إنجازه بنجاح ✅' : 'قيد الدراسة ⏳'}</span>
          </div>
        </div>

        ${lesson.objectives && lesson.objectives.length > 0 ? `
          <div class="objectives-card">
            <div class="objectives-title">
              <span>أهداف هذا الدرس</span>
            </div>
            <ul class="objectives-list">
              ${lesson.objectives.map(obj => `<li>${obj}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Educational Content Sections -->
        <article class="lesson-article">
          ${(lesson.sections || []).map((sec, idx) => {
            if (sec.type === 'text') {
              return `
                <div>
                  ${sec.title ? `<h3 class="lesson-section-title">${sec.title}</h3>` : ''}
                  <p>${sec.content}</p>
                </div>
              `;
            } else if (sec.type === 'callout') {
              return `
                <div class="callout callout-${sec.tone || 'info'}">
                  <div>
                    <div class="callout-title">${sec.title}</div>
                    <div class="callout-body">${sec.content}</div>
                  </div>
                </div>
              `;
            } else if (sec.type === 'code') {
              return `
                <div class="lesson-code-block">
                  <div class="lesson-code-header">
                    <span class="code-lang-label">${sec.language || 'javascript'}</span>
                    <div class="code-block-actions">
                      <button class="btn btn-secondary btn-sm copy-code-trigger" data-code="${encodeURIComponent(sec.code)}">
                        ${ICONS.copy}
                        <span>نسخ الكود</span>
                      </button>
                      <button class="btn btn-primary btn-sm run-playground-trigger" data-code="${encodeURIComponent(sec.code)}" data-lang="${sec.language || 'javascript'}">
                        ${ICONS.terminal}
                        <span>جرب في المختبر</span>
                      </button>
                    </div>
                  </div>
                  <pre class="lesson-code-content"><code>${this.escapeHtml(sec.code)}</code></pre>
                  ${sec.explanation ? `<div class="code-explanation">${sec.explanation}</div>` : ''}
                </div>
              `;
            } else if (sec.type === 'activity') {
              return `
                <div class="callout callout-warning">
                  <div>
                    <div class="callout-title">${sec.title}</div>
                    <div class="callout-body">${sec.description}</div>
                  </div>
                </div>
              `;
            } else if (sec.type === 'key-terms') {
              return `
                <div class="card" style="padding: var(--space-5); margin: var(--space-4) 0; background: var(--bg-surface-elevated);">
                  ${sec.title ? `<h3 class="lesson-section-title" style="margin-top: 0;">${sec.title}</h3>` : ''}
                  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-3);">
                    ${(sec.terms || []).map(t => `
                      <div style="background: var(--bg-surface); padding: var(--space-3); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                          <strong style="color: var(--accent-blue); font-size: var(--text-sm);">${t.term}</strong>
                          <span style="font-family: monospace; font-size: 11px; color: var(--text-muted); direction: ltr;">${t.termEn || ''}</span>
                        </div>
                        <div style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.5;">${t.definition}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;
            } else if (sec.type === 'table') {
              return `
                <div class="card" style="padding: var(--space-4); margin: var(--space-4) 0; overflow-x: auto;">
                  ${sec.title ? `<h3 class="lesson-section-title" style="margin-top: 0;">${sec.title}</h3>` : ''}
                  <table style="width: 100%; border-collapse: collapse; font-size: var(--text-xs); text-align: right;">
                    <thead>
                      <tr style="border-bottom: 2px solid var(--border-subtle); color: var(--accent-indigo);">
                        ${(sec.headers || []).map(h => `<th style="padding: 8px 12px; font-weight: 700;">${h}</th>`).join('')}
                      </tr>
                    </thead>
                    <tbody>
                      ${(sec.rows || []).map(row => `
                        <tr style="border-bottom: 1px solid var(--border-subtle);">
                          ${row.map(cell => `<td style="padding: 8px 12px; color: var(--text-secondary);">${cell}</td>`).join('')}
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              `;
            } else if (sec.type === 'diagram') {
              return `
                <div class="card" style="padding: var(--space-5); margin: var(--space-4) 0; background: #0c1220; border-color: rgba(99,102,241,0.3);">
                  ${sec.title ? `<h3 class="lesson-section-title" style="margin-top: 0; color: var(--accent-blue);">${sec.title}</h3>` : ''}
                  <pre style="font-family: monospace; font-size: 12px; line-height: 1.4; color: #a5b4fc; overflow-x: auto; margin: 0; direction: ltr; text-align: left;"><code>${this.escapeHtml(sec.ascii || sec.diagram || sec.content || '')}</code></pre>
                  ${sec.caption ? `<div style="font-size: 11px; color: var(--text-muted); margin-top: var(--space-2);">${sec.caption}</div>` : ''}
                </div>
              `;
            }
            return '';
          }).join('')}
        </article>

        <!-- Embedded Programmer's Calculator for Lesson 09 -->
        ${lessonId === 'PF1-L09' ? `
          <div class="card" style="padding: var(--space-6); margin-top: var(--space-6); border: 2px solid rgba(56, 189, 248, 0.4); background: linear-gradient(135deg, rgba(16, 22, 38, 0.95), rgba(23, 33, 56, 0.95));">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-2);">
              <div style="display: flex; align-items: center; gap: var(--space-2);">
                <span class="stat-icon-wrapper stat-icon-cyan" style="width: 38px; height: 38px;">🧮</span>
                <div>
                  <h3 style="font-size: var(--text-base); font-weight: 800; color: #FFFFFF;">آلة حاسبة المبرمج التفاعلية الحية</h3>
                  <span style="font-size: var(--text-xs); color: var(--accent-blue);">جرب تحويل الأرقام وعمليات البت مباشرة أثناء دراستك لهذا الدرس</span>
                </div>
              </div>
              <a href="#calculator" class="btn btn-secondary btn-sm">فتح في شاشة كاملة ↗</a>
            </div>
            <div id="embedded-calc-widget"></div>
          </div>
        ` : ''}

        <!-- Summary -->
        ${lesson.summary ? `
          <div class="summary-card">
            <h3 class="summary-title">ملخص الدرس</h3>
            <p class="summary-text">${lesson.summary}</p>
          </div>
        ` : ''}

        <!-- Interactive Assessments Hub -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-top: var(--space-4);">
          ${lesson.quizId ? `
            <a href="#quiz/${lesson.quizId}" class="card card-clickable" style="padding: var(--space-5); text-align: center;">
              <div style="color: var(--accent-indigo); margin-bottom: var(--space-2);">${ICONS.award}</div>
              <h3 style="font-size: var(--text-base); font-weight: 700;">اختبار الفهم للدرس</h3>
              <p style="font-size: var(--text-xs); color: var(--text-muted); margin: var(--space-1) 0 var(--space-3);">أسئلة اختيار من متعدد وفحص الكود</p>
              <span class="btn btn-primary btn-sm">بدء الاختبار (+50 XP)</span>
            </a>
          ` : ''}

          ${lesson.exerciseId ? `
            <a href="#exercise/${lesson.exerciseId}" class="card card-clickable" style="padding: var(--space-5); text-align: center;">
              <div style="color: var(--accent-blue); margin-bottom: var(--space-2);">${ICONS.terminal}</div>
              <h3 style="font-size: var(--text-base); font-weight: 700;">التمرين البرمجي التفاعلي</h3>
              <p style="font-size: var(--text-xs); color: var(--text-muted); margin: var(--space-1) 0 var(--space-3);">كتابة كود وفحصه في المحرر</p>
              <span class="btn btn-secondary btn-sm">فتح التمرين (+40 XP)</span>
            </a>
          ` : ''}
        </div>

        <!-- Personal Notes Section for this lesson -->
        <div class="card" style="padding: var(--space-6); margin-top: var(--space-6);">
          <h3 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-3);">ملاحظاتي الشخصية حول هذا الدرس</h3>
          
          <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-4);">
            <textarea id="lesson-note-input" rows="2" placeholder="اكتب فكرة أو سؤالاً برمجياً لترسيخ الفهم..." style="flex: 1;"></textarea>
            <button id="save-note-btn" class="btn btn-secondary" style="align-self: flex-end;">حفظ الملاحظة</button>
          </div>

          <div id="lesson-notes-list" style="display: flex; flex-direction: column; gap: var(--space-2);">
            ${thisLessonNotes.length > 0 ? thisLessonNotes.map(n => `
              <div class="activity-item">
                <span>${this.escapeHtml(n.content)}</span>
                <button class="btn btn-outline btn-sm delete-note-trigger" data-note-id="${n.id}">حذف</button>
              </div>
            `).join('') : '<p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0;">لا توجد ملاحظات مدونة بعد لهذا الدرس.</p>'}
          </div>
        </div>

        <!-- Bottom Navigation Controls -->
        <div class="lesson-nav-bar">
          <div>
            ${adjacent.prev ? `
              <a href="#lesson/${adjacent.prev.id}" class="btn btn-outline">
                ← الدرس السابق: ${adjacent.prev.title}
              </a>
            ` : '<span></span>'}
          </div>
          <div>
            ${adjacent.next ? `
              <a href="#lesson/${adjacent.next.id}" class="btn btn-primary">
                الدرس التالي: ${adjacent.next.title} →
              </a>
            ` : `
              <a href="#course/${lesson.courseId}" class="btn btn-primary">
                العودة لتفاصيل المساق
              </a>
            `}
          </div>
        </div>
      </div>
    `;

    // Completion Toggle Handler
    const completeBtn = document.getElementById('toggle-complete-btn');
    if (completeBtn && student) {
      completeBtn.addEventListener('click', async () => {
        const isNowCompleted = await LessonEngine.toggleLessonCompletion(student.id, lessonId);
        if (isNowCompleted) {
          await AchievementEngine.checkAndUnlock(student.id, 'badge_first_step');
          this.showToast('تم تحديد الدرس كمكتمل بنجاح!', 'success');
        }
        this.renderLesson(lessonId);
      });
    }

    // Bookmark Toggle Handler
    const bookmarkBtn = document.getElementById('bookmark-btn');
    if (bookmarkBtn && student) {
      bookmarkBtn.addEventListener('click', async () => {
        const bookmarked = await LessonEngine.toggleBookmark(student.id, lessonId, lesson.title);
        this.showToast(bookmarked ? 'تمت إضافة الدرس إلى المفضلة' : 'تمت الإزالة من المفضلة');
        this.renderLesson(lessonId);
      });
    }

    // Copy Code Buttons
    main.querySelectorAll('.copy-code-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = decodeURIComponent(btn.getAttribute('data-code'));
        navigator.clipboard.writeText(code).then(() => {
          this.showToast('تم نسخ الكود للحافظة!', 'success');
        });
      });
    });

    // Run in Playground Buttons
    main.querySelectorAll('.run-playground-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = decodeURIComponent(btn.getAttribute('data-code'));
        const lang = btn.getAttribute('data-lang') || 'javascript';
        EditorEngine.setCode(code, lang);
        Router.navigate('#playground');
      });
    });

    // Save Note Handler
    const saveNoteBtn = document.getElementById('save-note-btn');
    const noteInput = document.getElementById('lesson-note-input');
    if (saveNoteBtn && noteInput && student) {
      saveNoteBtn.addEventListener('click', async () => {
        const content = noteInput.value.trim();
        if (content) {
          await NotesEngine.saveNote({
            studentId: student.id,
            lessonId,
            lessonTitle: lesson.title,
            content
          });
          noteInput.value = '';
          this.showToast('تم حفظ الملاحظة بنجاح!', 'success');
          this.renderLesson(lessonId);
        }
      });
    }

    // Delete Note Handler
    main.querySelectorAll('.delete-note-trigger').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const noteId = btn.getAttribute('data-note-id');
        await NotesEngine.deleteNote(noteId);
        this.showToast('تم حذف الملاحظة');
        this.renderLesson(lessonId);
      });
    });

    // Initialize embedded calculator widget if present in Lesson 09
    const embeddedCalc = document.getElementById('embedded-calc-widget');
    if (embeddedCalc) {
      this.initCalculatorComponent(embeddedCalc);
    }
  },

  /* ========================================================
     SCREEN F: EXERCISES SCREEN (شاشة التمارين البرمجية)
  ======================================================== */
  async renderExercise(exerciseId) {
    const main = document.getElementById('app-main-viewport');
    const student = State.currentStudent;
    const exercise = await ExerciseEngine.getExercise(exerciseId);

    if (!exercise) {
      main.innerHTML = `<div class="card" style="padding: var(--space-8); text-align: center;"><h2>التمرين غير موجود</h2><a href="#curriculum" class="btn btn-primary">العودة</a></div>`;
      return;
    }

    const attempts = student ? await ExerciseEngine.getAttempts(student.id, exerciseId) : [];
    let currentHintsRevealed = 0;

    main.innerHTML = `
      <div class="exercise-container">
        <div class="breadcrumb-nav">
          <a href="#curriculum">المناهج</a>
          <span>/</span>
          <a href="#lesson/${exercise.lessonId}">الدرس</a>
          <span>/</span>
          <span style="color: var(--text-primary);">${exercise.title}</span>
        </div>

        <div class="exercise-split">
          <!-- Left: Instructions & Hints -->
          <div class="exercise-instructions-panel">
            <div>
              <div class="meta-row" style="margin-bottom: var(--space-2);">
                <span class="offline-pill" style="font-size: 11px;">مستوى: ${exercise.difficulty || 'مبتدئ'}</span>
                <span class="meta-separator">·</span>
                <span>لغة: JavaScript</span>
              </div>
              <h1 style="font-size: var(--text-xl); font-weight: 800;">${exercise.title}</h1>
            </div>

            <div class="callout callout-info" style="margin: 0;">
              <div>
                <div class="callout-title">الهدف المطلوب:</div>
                <div class="callout-body">${exercise.instructions}</div>
              </div>
            </div>

            <div style="background-color: var(--bg-surface-elevated); padding: var(--space-4); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-1);">المخرجات المتوقعة في الـ Console:</div>
              <code style="font-size: var(--text-sm); display: block; padding: var(--space-2);">${exercise.expectedResult}</code>
            </div>

            <!-- Hints Accordion -->
            <div class="exercise-hints-box">
              <div class="hints-header" id="show-hint-btn">
                <span>💡 تلميحات الحل المساعدة (${currentHintsRevealed}/${(exercise.hints || []).length})</span>
                <button class="btn btn-outline btn-sm">طلب تلميح</button>
              </div>
              <div id="hints-display-area" style="margin-top: var(--space-3); display: flex; flex-direction: column; gap: var(--space-2);"></div>
            </div>

            <!-- Solution Reveal Button -->
            <div>
              <button id="reveal-solution-btn" class="btn btn-outline btn-sm" style="color: var(--text-muted);">
                عرض الحل النموذجي
              </button>
              <div id="solution-display-area" class="hidden" style="margin-top: var(--space-3);">
                <pre style="font-size: var(--text-xs);"><code class="language-javascript">${this.escapeHtml(exercise.solutionCode)}</code></pre>
              </div>
            </div>

            <!-- Previous Attempts -->
            ${attempts.length > 0 ? `
              <div style="border-top: 1px solid var(--border-subtle); padding-top: var(--space-4);">
                <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-2);">سجل المحاولات السابقة:</div>
                <div style="display: flex; flex-direction: column; gap: var(--space-1); max-height: 120px; overflow-y: auto;">
                  ${attempts.map((a, i) => `
                    <div style="font-size: var(--text-xs); display: flex; justify-content: space-between; padding: 4px 8px; background: var(--bg-surface-highlight); border-radius: 4px;">
                      <span>محاولة #${attempts.length - i} (${a.isSuccess ? 'ناجحة ✅' : 'تحتاج تعديل ❌'})</span>
                      <span class="tabular-nums" style="color: var(--text-muted);">${new Date(a.timestamp).toLocaleTimeString()}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Right: Code Editor & Live Evaluation Output -->
          <div class="editor-pane" style="height: 540px;">
            <div class="editor-pane-header">
              <span class="editor-pane-title">محرر التمارين (JavaScript)</span>
              <div style="display: flex; gap: var(--space-2);">
                <button id="reset-exercise-code-btn" class="btn btn-secondary btn-sm">إعادة تعيين</button>
                <button id="test-exercise-btn" class="btn btn-primary btn-sm">
                  ${ICONS.play}
                  <span>اختبار الكود وتأكيد الإجابة</span>
                </button>
              </div>
            </div>

            <div id="exercise-editor-container" class="editor-viewport-target"></div>

            <!-- Evaluation Feedback Drawer -->
            <div id="exercise-feedback-drawer" style="padding: var(--space-4); background-color: #070B14; border-top: 1px solid var(--border-medium); font-size: var(--text-sm);">
              <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-1);">مخرجات التقييم الآلي:</div>
              <div id="exercise-feedback-text" style="color: var(--text-secondary);">اضغط على "اختبار الكود وتأكيد الإجابة" لفحص حلك.</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Mount CodeMirror
    const editorTarget = document.getElementById('exercise-editor-container');
    EditorEngine.initEditor(editorTarget, 'javascript', exercise.initialCode);

    // Test & Submit handler
    const testBtn = document.getElementById('test-exercise-btn');
    testBtn.addEventListener('click', async () => {
      const currentCode = EditorEngine.getCode();
      const feedbackEl = document.getElementById('exercise-feedback-text');
      feedbackEl.innerHTML = `<span style="color: var(--accent-blue);">جاري اختبار الكود...</span>`;

      const result = await ExerciseEngine.evaluateExercise(student.id, exercise.id, currentCode);

      if (result.isSuccess) {
        feedbackEl.innerHTML = `<span style="color: var(--status-success); font-weight: 700;">✅ ${result.feedback}</span>`;
        this.showToast('أحسنت! إجابة صحيحة (+40 XP)', 'success');
      } else {
        feedbackEl.innerHTML = `<span style="color: var(--status-error);">❌ ${result.feedback}</span>`;
      }
    });

    // Reset code handler
    document.getElementById('reset-exercise-code-btn').addEventListener('click', () => {
      EditorEngine.setCode(exercise.initialCode);
      document.getElementById('exercise-feedback-text').textContent = 'تمت إعادة ضبط الكود إلى الحالة الأولية.';
    });

    // Hints disclosure handler
    document.getElementById('show-hint-btn').addEventListener('click', () => {
      if (exercise.hints && currentHintsRevealed < exercise.hints.length) {
        currentHintsRevealed++;
        const hintsArea = document.getElementById('hints-display-area');
        hintsArea.innerHTML = exercise.hints.slice(0, currentHintsRevealed).map((hint, idx) => `
          <div style="font-size: var(--text-xs); padding: var(--space-2) var(--space-3); background: rgba(245, 158, 11, 0.1); border-radius: var(--radius-sm); border: 1px solid rgba(245, 158, 11, 0.2);">
            <strong>تلميح ${idx + 1}:</strong> ${hint}
          </div>
        `).join('');
      }
    });

    // Reveal solution handler
    document.getElementById('reveal-solution-btn').addEventListener('click', () => {
      const area = document.getElementById('solution-display-area');
      area.classList.toggle('hidden');
    });
  },

  /* ========================================================
     SCREEN G: QUIZ SCREEN (شاشة الاختبارات البرمجية)
  ======================================================== */
  async renderQuiz(quizId) {
    const main = document.getElementById('app-main-viewport');
    const student = State.currentStudent;
    const quiz = await QuizEngine.getQuiz(quizId);

    if (!quiz) {
      main.innerHTML = `<div class="card" style="padding: var(--space-8); text-align: center;"><h2>الاختبار غير موجود</h2><a href="#curriculum" class="btn btn-primary">العودة</a></div>`;
      return;
    }

    let currentQuestionIdx = 0;
    const userAnswers = {};
    let isSubmitted = false;

    const renderQuizStep = () => {
      const q = quiz.questions[currentQuestionIdx];
      const isLast = currentQuestionIdx === quiz.questions.length - 1;

      main.innerHTML = `
        <div class="quiz-container">
          <div class="breadcrumb-nav">
            <a href="#curriculum">المناهج</a>
            <span>/</span>
            <a href="#lesson/${quiz.lessonId}">الدرس</a>
            <span>/</span>
            <span style="color: var(--text-primary);">${quiz.title}</span>
          </div>

          <div class="quiz-progress-indicator">
            <span>السؤال ${currentQuestionIdx + 1} من ${quiz.questions.length}</span>
            <span>درجة النجاح المطلوبة: ${quiz.passingScore || 70}%</span>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" style="width: ${((currentQuestionIdx + 1) / quiz.questions.length) * 100}%;"></div>
          </div>

          <div class="question-card">
            <h2 class="question-prompt">${q.prompt}</h2>

            ${q.code ? `
              <pre class="lesson-code-content" style="background: #080C16; border-radius: var(--radius-md); padding: var(--space-3); border: 1px solid var(--border-subtle);"><code class="language-javascript">${this.escapeHtml(q.code)}</code></pre>
            ` : ''}

            <div class="question-options-list">
              ${q.options.map((opt, oIdx) => `
                <button class="quiz-option-btn ${userAnswers[q.id] === oIdx ? 'selected' : ''}" data-opt-idx="${oIdx}">
                  <span>${opt}</span>
                  <span style="font-size: var(--text-xs); color: var(--text-muted);">${String.fromCharCode(65 + oIdx)}</span>
                </button>
              `).join('')}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-4);">
              <button id="prev-question-btn" class="btn btn-secondary" ${currentQuestionIdx === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
                السؤال السابق
              </button>

              ${isLast ? `
                <button id="submit-quiz-btn" class="btn btn-primary btn-lg" ${userAnswers[q.id] === undefined ? 'disabled style="opacity: 0.5;"' : ''}>
                  إنهاء الاختبار وإظهار النتيجة
                </button>
              ` : `
                <button id="next-question-btn" class="btn btn-primary" ${userAnswers[q.id] === undefined ? 'disabled style="opacity: 0.5;"' : ''}>
                  السؤال التالي ←
                </button>
              `}
            </div>
          </div>
        </div>
      `;

      // Option click
      main.querySelectorAll('[data-opt-idx]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const optIdx = Number(btn.getAttribute('data-opt-idx'));
          userAnswers[q.id] = optIdx;
          renderQuizStep();
        });
      });

      // Navigation
      const prevBtn = document.getElementById('prev-question-btn');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentQuestionIdx > 0) {
            currentQuestionIdx--;
            renderQuizStep();
          }
        });
      }

      const nextBtn = document.getElementById('next-question-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentQuestionIdx < quiz.questions.length - 1) {
            currentQuestionIdx++;
            renderQuizStep();
          }
        });
      }

      // Submit
      const submitBtn = document.getElementById('submit-quiz-btn');
      if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
          const attempt = await QuizEngine.submitQuiz(student.id, quiz.id, userAnswers);
          if (attempt.isPassed && attempt.scorePercentage === 100) {
            await AchievementEngine.checkAndUnlock(student.id, 'badge_quiz_ace');
          }
          renderQuizResults(attempt);
        });
      }
    };

    const renderQuizResults = (attempt) => {
      main.innerHTML = `
        <div class="quiz-container">
          <div class="quiz-results-card">
            <div style="font-size: 3rem;">${attempt.isPassed ? '🎉' : '🔄'}</div>
            <div class="quiz-score-badge">${attempt.scorePercentage}%</div>
            <h2 style="font-size: var(--text-2xl); font-weight: 800;">
              ${attempt.isPassed ? 'تهانينا! لقد اجتزت الاختبار بنجاح' : 'تحتاج لمراجعة سريعة للمفاهيم'}
            </h2>
            <p style="font-size: var(--text-sm); color: var(--text-secondary); max-width: 500px;">
              أجبت على ${attempt.correctCount} من ${attempt.totalQuestions} أسئلة بشكل صحيح.
              ${attempt.isPassed ? 'تم منحك 50 نقطة XP إضافية في حسابك الأكاديمي!' : 'لا تقلق، البرمجة تعتمد على التجربة والتعلم من الأخطاء.'}
            </p>

            <div style="display: flex; gap: var(--space-3); margin-top: var(--space-4);">
              <button id="retry-quiz-btn" class="btn btn-secondary">إعادة الاختبار</button>
              <a href="#lesson/${quiz.lessonId}" class="btn btn-primary">العودة للدرس</a>
            </div>
          </div>

          <!-- Explanations & Answers Breakdown -->
          <div style="display: flex; flex-direction: column; gap: var(--space-4); margin-top: var(--space-4);">
            <h3 style="font-size: var(--text-lg); font-weight: 700;">مراجعة الإجابات والتعليلات البرمجية:</h3>
            ${attempt.breakdown.map((b, idx) => `
              <div class="card" style="padding: var(--space-5); border-right: 4px solid ${b.isCorrect ? 'var(--status-success)' : 'var(--status-error)'};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-2);">
                  <span style="font-weight: 700; font-size: var(--text-sm);">سؤال ${idx + 1}: ${b.prompt}</span>
                  <span style="font-size: var(--text-xs); color: ${b.isCorrect ? 'var(--status-success)' : 'var(--status-error)'}; font-weight: 700;">
                    ${b.isCorrect ? 'إجابة صحيحة ✓' : 'إجابة غير صحيحة ✗'}
                  </span>
                </div>
                <div class="quiz-explanation-box">
                  <strong>الشرح والتعليل:</strong> ${b.explanation}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      document.getElementById('retry-quiz-btn').addEventListener('click', () => {
        this.renderQuiz(quizId);
      });
    };

    renderQuizStep();
  },

  /* ========================================================
     SCREEN H: PROGRAMMING PLAYGROUND (مختبر البرمجة المفتوح)
  ======================================================== */
  async renderPlayground() {
    const main = document.getElementById('app-main-viewport');
    const student = State.currentStudent;
    const savedProjects = student ? await EditorEngine.getSavedProjects(student.id) : [];

    main.innerHTML = `
      <div class="playground-container">
        <!-- Playground Toolbar -->
        <div class="playground-toolbar">
          <div style="display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
            <div class="editor-tabs">
              <button class="editor-tab-btn active" data-editor-tab="javascript">JS (منطق)</button>
              <button class="editor-tab-btn" data-editor-tab="html">HTML (هيكل)</button>
              <button class="editor-tab-btn" data-editor-tab="css">CSS (تنسيق)</button>
            </div>

            <!-- Templates Dropdown -->
            <select id="load-template-select" style="width: auto; padding: 4px 12px; font-size: var(--text-xs);">
              <option value="">📂 تحميل نموذج جاهز...</option>
              <option value="counter">عداد نقرات تفاعلي (Counter)</option>
              <option value="clock">ساعة رقمية حية (Digital Clock)</option>
            </select>
          </div>

          <div style="display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap;">
            <button id="save-project-btn" class="btn btn-secondary btn-sm" title="حفظ المشروع محلياً في جهازك">
              ${ICONS.bookmark}
              <span>حفظ المشروع</span>
            </button>
            <button id="reset-code-btn" class="btn btn-secondary btn-sm" title="إعادة ضبط الأكواد">
              إعادة ضبط
            </button>
            <button id="run-code-btn" class="btn btn-primary btn-sm">
              ${ICONS.play}
              <span>تشغيل الكود 🚀</span>
            </button>
          </div>
        </div>

        <!-- Playground Workspace Split -->
        <div class="playground-workspace">
          <!-- Left: Code Editor -->
          <div class="editor-pane">
            <div class="editor-pane-header">
              <span id="active-tab-title" class="editor-pane-title">محرر JavaScript (CodeMirror 6)</span>
              <span style="font-size: 11px; color: var(--text-muted);">تحرير مباشر</span>
            </div>
            <div id="codemirror-workspace-target" class="editor-viewport-target"></div>
          </div>

          <!-- Right: Live Preview & Console Output -->
          <div class="preview-pane">
            <div class="preview-pane-header">
              <span style="font-size: var(--text-xs); font-weight: 700;">المعاينة المباشرة (Sandboxed Iframe)</span>
              <span class="online-pill" style="font-size: 10px;">عزل آمن للذاكرة</span>
            </div>

            <div class="preview-body-container">
              <iframe id="playground-preview-frame" class="preview-iframe" sandbox="allow-scripts"></iframe>

              <!-- Live Console Drawer -->
              <div class="console-container">
                <div class="console-header">
                  <span>لوحة مخرجات الكود (Console Output)</span>
                  <button id="clear-console-btn" class="btn btn-sm" style="padding: 2px 8px; font-size: 10px; color: var(--text-muted);">
                    مسح اللوحة
                  </button>
                </div>
                <div id="playground-console-list" class="console-logs-list">
                  <div class="console-log-entry info">جاهز لتشغيل الأكواد واستقبال مخرجات console.log.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Mount CodeMirror
    const target = document.getElementById('codemirror-workspace-target');
    EditorEngine.initEditor(target, 'javascript');

    // Initial run
    setTimeout(() => {
      EditorEngine.runCode();
    }, 100);

    // Tab Switcher handlers
    main.querySelectorAll('[data-editor-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        main.querySelectorAll('[data-editor-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.getAttribute('data-editor-tab');
        EditorEngine.switchTab(lang);

        const titleMap = { javascript: 'JavaScript (منطق)', html: 'HTML (هيكل الصفحة)', css: 'CSS (أنماط وتنسيق)' };
        document.getElementById('active-tab-title').textContent = `محرر ${titleMap[lang]} (CodeMirror 6)`;
      });
    });

    // Run Code Handler
    document.getElementById('run-code-btn').addEventListener('click', () => {
      EditorEngine.runCode();
      this.showToast('تم تحديث وتشغيل الكود في المعاينة!', 'success');
    });

    // Reset Code Handler
    document.getElementById('reset-code-btn').addEventListener('click', () => {
      if (confirm('هل تريد بالتأكيد إعادة ضبط محرر الأكواد إلى النموذج الافتراضي؟')) {
        EditorEngine.resetCode();
        EditorEngine.runCode();
        this.showToast('تمت إعادة ضبط المختبر');
      }
    });

    // Template Selector
    document.getElementById('load-template-select').addEventListener('change', (e) => {
      const template = e.target.value;
      if (template) {
        EditorEngine.loadSample(template);
        this.showToast(`تم تحميل نموذج "${template === 'counter' ? 'عداد تفاعلي' : 'ساعة رقمية'}" بنجاح!`, 'success');
      }
    });

    // Clear Console
    document.getElementById('clear-console-btn').addEventListener('click', () => {
      EditorEngine.clearConsole();
    });

    // Save Project Handler
    document.getElementById('save-project-btn').addEventListener('click', async () => {
      const title = prompt('أدخل اسماً لمشروعك البرمجي:', 'مشروع برمجي جديد');
      if (title && title.trim()) {
        await EditorEngine.saveProject(title);
        this.showToast(`تم حفظ المشروع "${title}" بنجاح في جهازك!`, 'success');
      }
    });
  },

  /* ========================================================
     SCREEN I: ACHIEVEMENTS & CERTIFICATES (شاشة الإنجازات)
  ======================================================== */
  async renderAchievements() {
    const main = document.getElementById('app-main-viewport');
    const student = State.currentStudent;
    const achievements = student ? await AchievementEngine.getStudentAchievements(student.id) : [];

    main.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6);">
        <div>
          <h1 style="font-size: var(--text-2xl); font-weight: 800; margin-bottom: var(--space-1);">سجل الإنجارات والشارات الأكاديمية</h1>
          <p style="font-size: var(--text-sm); color: var(--text-secondary);">
            كل سطر كود وكل تمرين تحله يمنحك نقاط خبرة XP وشارات استحقاق توثق تطورك المهني.
          </p>
        </div>

        <!-- Badges Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-4);">
          ${achievements.map((b) => `
            <div class="card" style="padding: var(--space-5); opacity: ${b.isUnlocked ? '1' : '0.55'};">
              <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3);">
                <div class="stat-icon-wrapper ${b.isUnlocked ? 'stat-icon-amber' : 'stat-icon-indigo'}" style="width: 44px; height: 44px;">
                  ${b.isUnlocked ? ICONS.award : ICONS.lock}
                </div>
                <div>
                  <h3 style="font-size: var(--text-base); font-weight: 700;">${b.title}</h3>
                  <span style="font-size: var(--text-xs); color: ${b.isUnlocked ? 'var(--status-success)' : 'var(--text-muted)'}; font-weight: 600;">
                    ${b.isUnlocked ? 'مكتسب ✓' : 'قيد الإنجاز 🔒'}
                  </span>
                </div>
              </div>
              <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.5; margin-bottom: var(--space-2);">
                ${b.description}
              </p>
              <div class="meta-row" style="font-size: 11px;">
                <span>+${b.points} XP</span>
                ${b.unlockedAt ? `
                  <span class="meta-separator">·</span>
                  <span>تم الفتح في: ${new Date(b.unlockedAt).toLocaleDateString('ar-EG')}</span>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Printable Certificate Section -->
        <div class="card certificate-card" style="padding: var(--space-8); background: linear-gradient(135deg, #101626 0%, #172138 100%); border: 2px solid rgba(99, 102, 241, 0.4); border-radius: var(--radius-xl); text-align: center; position: relative;">
          <div style="font-size: var(--text-xs); color: var(--accent-blue); font-weight: 700; letter-spacing: 1px; margin-bottom: var(--space-2);">
            PROGRAMMING ACADEMY · شهادة إنجاز أكاديمي
          </div>
          <h2 style="font-size: var(--text-2xl); font-weight: 800; color: #FFFFFF; margin-bottom: var(--space-2);">
            شهادة إتمام الأساسيات البرمجية
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-secondary); max-width: 600px; margin: 0 auto var(--space-4);">
            تشهد أكاديمية البرمجة بأن الطالب <strong>${student ? student.name : 'الطالب'}</strong> قد أتم بنجاح متطلبات المساقات التأسيسية للسنة الأولى بمجموع نقاط ${student ? student.points : 0} XP.
          </p>
          <div class="meta-row" style="justify-content: center; margin-bottom: var(--space-6);">
            <span>التاريخ: ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span class="meta-separator">·</span>
            <span>الرمز المرجعي: ACAD-${Date.now().toString().slice(-6)}</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.print()">
            ${ICONS.download}
            <span>طباعة أو حفظ الشهادة كـ PDF</span>
          </button>
        </div>
      </div>
    `;
  },

  /* ========================================================
     SCREEN J: NOTES AND BOOKMARKS (الملاحظات والإشارات)
  ======================================================== */
  async renderNotesAndBookmarks() {
    const main = document.getElementById('app-main-viewport');
    const student = State.currentStudent;
    const [notes, bookmarks] = await Promise.all([
      student ? NotesEngine.getNotes(student.id) : [],
      student ? NotesEngine.getBookmarks(student.id) : []
    ]);

    main.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6);">
        <div>
          <h1 style="font-size: var(--text-2xl); font-weight: 800; margin-bottom: var(--space-1);">الملاحظات والإشارات المرجعية</h1>
          <p style="font-size: var(--text-sm); color: var(--text-secondary);">
            جميع ملاحظاتك الدراسية والدروس المحفوظة مخزنة محلياً ويمكنك البحث فيها في أي وقت.
          </p>
        </div>

        <!-- Bookmarks Section -->
        <div class="card" style="padding: var(--space-5);">
          <h2 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2);">
            <span>${ICONS.bookmark}</span>
            <span>الدروس المحفوظة في المفضلة (${bookmarks.length})</span>
          </h2>
          ${bookmarks.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: var(--space-2);">
              ${bookmarks.map(b => `
                <div class="lesson-row" onclick="window.location.hash='#lesson/${b.lessonId}'">
                  <span style="font-weight: 600;">${b.lessonTitle}</span>
                  <span style="font-size: var(--text-xs); color: var(--accent-blue);">فتح الدرس ←</span>
                </div>
              `).join('')}
            </div>
          ` : '<p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0;">لم تحفظ أي دروس في المفضلة بعد. اضغط على "حفظ كإشارة" في شاشة أي درس.</p>'}
        </div>

        <!-- Notes Search & List -->
        <div class="card" style="padding: var(--space-5);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-3);">
            <h2 style="font-size: var(--text-base); font-weight: 700;">الملاحظات الشخصية (${notes.length})</h2>
            <input type="text" id="notes-search-input" placeholder="بحث في الملاحظات..." style="width: 240px; padding: 6px 12px;" />
          </div>

          <div id="notes-results-container" style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${notes.length > 0 ? notes.map(n => `
              <div class="card" style="padding: var(--space-4); background-color: var(--bg-surface-elevated);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-2);">
                  <span style="font-size: var(--text-xs); color: var(--accent-indigo); font-weight: 600;">${n.lessonTitle || 'ملاحظة عامة'}</span>
                  <button class="btn btn-outline btn-sm delete-note-btn" data-id="${n.id}">حذف</button>
                </div>
                <p style="font-size: var(--text-sm); color: var(--text-primary); margin: 0; line-height: 1.6;">
                  ${this.escapeHtml(n.content)}
                </p>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: var(--space-2);">
                  ${new Date(n.updatedAt).toLocaleDateString('ar-EG')} · ${new Date(n.updatedAt).toLocaleTimeString()}
                </div>
              </div>
            `).join('') : '<p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0;">لا توجد ملاحظات مدونة بعد.</p>'}
          </div>
        </div>
      </div>
    `;

    // Search filter
    const searchInput = document.getElementById('notes-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', async (e) => {
        const query = e.target.value;
        const filtered = await NotesEngine.getNotes(student.id, query);
        const container = document.getElementById('notes-results-container');
        if (container) {
          container.innerHTML = filtered.length > 0 ? filtered.map(n => `
            <div class="card" style="padding: var(--space-4); background-color: var(--bg-surface-elevated);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-2);">
                <span style="font-size: var(--text-xs); color: var(--accent-indigo); font-weight: 600;">${n.lessonTitle || 'ملاحظة عامة'}</span>
                <button class="btn btn-outline btn-sm delete-note-btn" data-id="${n.id}">حذف</button>
              </div>
              <p style="font-size: var(--text-sm); color: var(--text-primary); margin: 0;">${this.escapeHtml(n.content)}</p>
            </div>
          `).join('') : '<p style="font-size: var(--text-xs); color: var(--text-muted);">لا توجد نتائج مطابقة للبحث.</p>';
        }
      });
    }

    // Delete notes handler
    main.querySelectorAll('.delete-note-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        await NotesEngine.deleteNote(id);
        this.showToast('تم حذف الملاحظة');
        this.renderNotesAndBookmarks();
      });
    });
  },

  /* ========================================================
     SCREEN K: SETTINGS & BACKUP SCREEN (الإعدادات والنسخ)
  ======================================================== */
  async renderSettings() {
    const main = document.getElementById('app-main-viewport');
    const student = State.currentStudent;
    const storageEst = await OfflineManager.getStorageEstimate();

    main.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6);">
        <div>
          <h1 style="font-size: var(--text-2xl); font-weight: 800; margin-bottom: var(--space-1);">الإعدادات وإدارة البيانات</h1>
          <p style="font-size: var(--text-sm); color: var(--text-secondary);">
            التحكم في المظهر وحجم الخطوط، وحفظ واستيراد النسخ الاحتياطية محلياً.
          </p>
        </div>

        <!-- Student Profile Card -->
        <div class="card" style="padding: var(--space-6);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-4);">
            <div style="display: flex; align-items: center; gap: var(--space-4);">
              <div class="stat-icon-wrapper stat-icon-blue" style="width: 56px; height: 56px; font-size: 1.5rem; font-weight: bold;">
                ${student ? student.name.charAt(0).toUpperCase() : '؟'}
              </div>
              <div>
                <h3 style="font-size: var(--text-lg); font-weight: 700;">${student ? student.name : 'غير محدد'}</h3>
                <div class="meta-row">
                  <span>المستوى ${student ? student.level : 1}</span>
                  <span class="meta-separator">·</span>
                  <span>${student ? student.points : 0} نقطة XP</span>
                  <span class="meta-separator">·</span>
                  <span>الهدف: ${student ? student.dailyGoal : 20} دقيقة يومياً</span>
                </div>
              </div>
            </div>

            <a href="#welcome" class="btn btn-secondary btn-sm">تبديل / إنشاء حساب طالب</a>
          </div>
        </div>

        <!-- Appearance & Reading Preferences -->
        <div class="card" style="padding: var(--space-6);">
          <h2 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-4);">تفضيلات العرض والمظهر</h2>
          
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600; font-size: var(--text-sm);">نمط المظهر اللوني</div>
                <div style="font-size: var(--text-xs); color: var(--text-muted);">اختر بين النمط الكحلي الداكن المريح للعين أو النمط الفاتح</div>
              </div>
              <div class="filter-tabs">
                <button class="filter-tab ${State.theme === 'dark' ? 'active' : ''}" data-set-theme="dark">كحلي ليلي (افتراضي)</button>
                <button class="filter-tab ${State.theme === 'light' ? 'active' : ''}" data-set-theme="light">فاتح أنيق</button>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 600; font-size: var(--text-sm);">حجم الخطوط البرمجية</div>
                <div style="font-size: var(--text-xs); color: var(--text-muted);">تكبير حجم نصوص الشرح والأكواد للقراءة السلسة</div>
              </div>
              <div class="filter-tabs">
                <button class="filter-tab ${State.fontSize === 'normal' ? 'active' : ''}" data-set-fontsize="normal">عادي</button>
                <button class="filter-tab ${State.fontSize === 'large' ? 'active' : ''}" data-set-fontsize="large">كبير</button>
                <button class="filter-tab ${State.fontSize === 'xlarge' ? 'active' : ''}" data-set-fontsize="xlarge">كبير جداً</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Backup & Restore Hub -->
        <div class="card" style="padding: var(--space-6);">
          <h2 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-2);">النسخ الاحتياطي والاستعادة المحلية</h2>
          <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-4);">
            بياناتك ملك لك ومحفوظة بالكامل في جهازك. يمكنك تصدير نسخة احتياطية بصيغة JSON لنقلها إلى هاتف آخر أو متصفح آخر في أي وقت.
          </p>

          <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
            <button id="export-backup-btn" class="btn btn-primary">
              ${ICONS.download}
              <span>تصدير نسخة احتياطية كاملة (JSON)</span>
            </button>

            <label class="btn btn-secondary" style="cursor: pointer;">
              ${ICONS.upload}
              <span>استعادة نسخة من ملف JSON</span>
              <input type="file" id="import-backup-file-input" accept=".json" style="display: none;" />
            </label>
          </div>
        </div>

        <!-- App Information & Storage Quota -->
        <div class="card" style="padding: var(--space-6);">
          <h2 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-3);">معلومات المنصة والذاكرة</h2>
          <div class="meta-row" style="margin-bottom: var(--space-3);">
            <span>الإصدار: 1.0.0 (Capacitor Ready)</span>
            <span class="meta-separator">·</span>
            <span>المعمارية: Vanilla JS ES6+ Offline-First</span>
            <span class="meta-separator">·</span>
            <span>الذاكرة المستخدمة محلياً: ${storageEst.usageMB} ميجابايت من أصل ${storageEst.quotaMB} ميجابايت</span>
          </div>

          <!-- Reset Learning Progress with confirmation -->
          <div style="border-top: 1px solid var(--border-subtle); padding-top: var(--space-4); margin-top: var(--space-4);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3);">
              <div>
                <div style="font-weight: 600; font-size: var(--text-sm); color: var(--status-error);">إعادة ضبط التقدم الدراسي</div>
                <div style="font-size: var(--text-xs); color: var(--text-muted);">حذف نتائج الاختبارات والتمارين للبدء من جديد (لا يحذف الملاحظات)</div>
              </div>
              <button id="reset-progress-btn" class="btn btn-danger btn-sm">إعادة ضبط التقدم</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Theme Switcher
    main.querySelectorAll('[data-set-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-set-theme');
        State.setTheme(theme);
        this.renderSettings();
      });
    });

    // Font Size Switcher
    main.querySelectorAll('[data-set-fontsize]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const size = btn.getAttribute('data-set-fontsize');
        State.setFontSize(size);
        this.renderSettings();
      });
    });

    // Backup Export
    document.getElementById('export-backup-btn').addEventListener('click', async () => {
      await BackupEngine.exportBackup(student ? student.id : null);
      this.showToast('تم تصدير النسخة الاحتياطية بنجاح!', 'success');
    });

    // Backup Import
    const importInput = document.getElementById('import-backup-file-input');
    if (importInput) {
      importInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const parsed = BackupEngine.validateBackup(event.target.result);
            if (confirm(`تم التحقق من ملف النسخة الاحتياطية (${parsed.app}). هل تريد استيراد البيانات؟`)) {
              const counts = await BackupEngine.restoreBackup(parsed);
              this.showToast(`تم استيراد ${counts.lessonProgress} سجلاً تعليمياً بنجاح!`, 'success');
              await StudentManager.loadActiveStudent();
              this.renderSettings();
            }
          } catch (err) {
            alert('فشل استيراد الملف: ' + err.message);
          }
        };
        reader.readAsText(file);
      });
    }

    // Reset Progress Handler
    document.getElementById('reset-progress-btn').addEventListener('click', async () => {
      if (confirm('تنبيه: هل أنت متأكد تماماً من رغبتك في إعادة ضبط تقدمك الدراسي ونقاطك إلى الصفر؟ لا يمكن التراجع عن هذا الإجراء.')) {
        if (confirm('تأكيد نهائي: اضغط موافق لتصفير التقدم.')) {
          await BackupEngine.resetStudentProgress(student.id);
          this.showToast('تمت إعادة ضبط التقدم الدراسي بنجاح');
          this.renderSettings();
        }
      }
    });
  },

  /* ========================================================
     SCREEN K: PROGRAMMER CALCULATOR (شاشة آلة حاسبة المبرمج)
  ======================================================== */
  renderCalculatorScreen() {
    const main = document.getElementById('app-main-viewport');
    main.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-4);">
          <div>
            <h1 style="font-size: var(--text-2xl); font-weight: 800; margin-bottom: var(--space-1); display: flex; align-items: center; gap: var(--space-2);">
              <span>🧮</span>
              <span>آلة حاسبة المبرمج (Programmer's Calculator)</span>
            </h1>
            <p style="font-size: var(--text-sm); color: var(--text-secondary);">
              أداة تفاعلية متطورة لدراسة تمثيل الأرقام في الذاكرة، التحويل الفوري بين الأنظمة، وتبديل البتات باللمس.
            </p>
          </div>
          <a href="#lesson/PF1-L09" class="btn btn-outline btn-sm">
            📖 درس آلة حاسبة المبرمج
          </a>
        </div>

        <div id="full-calculator-container" class="card" style="padding: var(--space-6); background: linear-gradient(135deg, rgba(16, 22, 38, 0.98), rgba(23, 33, 56, 0.98)); border: 1px solid rgba(99, 102, 241, 0.3);"></div>
      </div>
    `;

    const container = document.getElementById('full-calculator-container');
    if (container) {
      this.initCalculatorComponent(container);
    }
  },

  /**
   * Reusable Interactive Programmer's Calculator Component
   */
  initCalculatorComponent(container) {
    if (!container) return;

    let currentValue = 42n;
    let wordSize = 32; // 8, 16, 32, 64
    let currentBase = 'DEC'; // 'HEX', 'DEC', 'OCT', 'BIN'
    let pendingOp = null;
    let storedValue = null;
    let freshEntry = true;

    const getMask = () => {
      if (wordSize === 8) return 0xFFn;
      if (wordSize === 16) return 0xFFFFn;
      if (wordSize === 32) return 0xFFFFFFFFn;
      return 0xFFFFFFFFFFFFFFFFn;
    };

    const render = () => {
      const mask = getMask();
      const val = currentValue & mask;

      // Hex string padded
      const hexNibbles = wordSize / 4;
      const hexStr = val.toString(16).toUpperCase().padStart(hexNibbles, '0');

      // Decimal (signed & unsigned)
      const decStr = val.toString(10);

      // Octal
      const octStr = val.toString(8);

      // Binary representation padded to wordSize
      const binStr = val.toString(2).padStart(wordSize, '0');

      container.innerHTML = `
        <div class="programmer-calculator-widget" style="display: flex; flex-direction: column; gap: var(--space-5);">
          <!-- Top Toolbar: Word Size Selector & Info -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3); border-bottom: 1px solid var(--border-subtle); padding-bottom: var(--space-3);">
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <span style="font-size: var(--text-xs); color: var(--text-secondary); font-weight: 600;">سعة الكلمة (Word Size):</span>
              <div class="editor-tabs" style="display: flex; gap: 4px;">
                <button class="calc-word-btn ${wordSize === 8 ? 'active' : ''}" data-size="8" style="padding: 3px 8px; font-size: 11px;">8-Bit</button>
                <button class="calc-word-btn ${wordSize === 16 ? 'active' : ''}" data-size="16" style="padding: 3px 8px; font-size: 11px;">16-Bit</button>
                <button class="calc-word-btn ${wordSize === 32 ? 'active' : ''}" data-size="32" style="padding: 3px 8px; font-size: 11px;">32-Bit (DWORD)</button>
                <button class="calc-word-btn ${wordSize === 64 ? 'active' : ''}" data-size="64" style="padding: 3px 8px; font-size: 11px;">64-Bit (QWORD)</button>
              </div>
            </div>

            <div style="font-size: var(--text-xs); color: var(--accent-blue); font-family: monospace;">
              ${pendingOp ? `العملية المعلقة: ${storedValue} ${pendingOp}` : 'جاهز'}
            </div>
          </div>

          <!-- Base Displays (HEX, DEC, OCT, BIN) -->
          <div style="display: flex; flex-direction: column; gap: var(--space-2); background: rgba(0, 0, 0, 0.4); padding: var(--space-4); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
            <div class="calc-base-row ${currentBase === 'HEX' ? 'active-base' : ''}" data-set-base="HEX" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 4px 8px; border-radius: var(--radius-sm);">
              <span style="font-weight: 700; font-size: var(--text-xs); color: var(--accent-indigo); width: 50px;">HEX</span>
              <span style="font-family: monospace; font-size: var(--text-lg); color: #FFFFFF; letter-spacing: 1px; direction: ltr;">0x${hexStr}</span>
            </div>

            <div class="calc-base-row ${currentBase === 'DEC' ? 'active-base' : ''}" data-set-base="DEC" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 4px 8px; border-radius: var(--radius-sm);">
              <span style="font-weight: 700; font-size: var(--text-xs); color: var(--accent-blue); width: 50px;">DEC</span>
              <span style="font-family: monospace; font-size: var(--text-xl); font-weight: 800; color: var(--accent-blue); direction: ltr;">${decStr}</span>
            </div>

            <div class="calc-base-row ${currentBase === 'OCT' ? 'active-base' : ''}" data-set-base="OCT" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 4px 8px; border-radius: var(--radius-sm);">
              <span style="font-weight: 700; font-size: var(--text-xs); color: #38bdf8; width: 50px;">OCT</span>
              <span style="font-family: monospace; font-size: var(--text-base); color: var(--text-secondary); direction: ltr;">${octStr}</span>
            </div>

            <div class="calc-base-row ${currentBase === 'BIN' ? 'active-base' : ''}" data-set-base="BIN" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 4px 8px; border-radius: var(--radius-sm);">
              <span style="font-weight: 700; font-size: var(--text-xs); color: #4ade80; width: 50px;">BIN</span>
              <span style="font-family: monospace; font-size: var(--text-xs); color: #4ade80; word-break: break-all; direction: ltr;">
                ${binStr.match(/.{1,4}/g)?.join(' ') || binStr}
              </span>
            </div>
          </div>

          <!-- Interactive Bit Toggle Matrix -->
          <div style="background: rgba(15, 23, 42, 0.6); padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
              <span style="font-size: var(--text-xs); font-weight: 700; color: var(--text-secondary);">
                مصفوفة البتات التفاعلية (اضغط على أي بت لتبديل قيمته 0 ↔ 1 فورياً):
              </span>
              <span style="font-size: 11px; color: var(--text-muted); font-family: monospace;">MSB [${wordSize - 1}] ← LSB [0]</span>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 6px; direction: ltr; justify-content: flex-end;">
              ${Array.from({ length: wordSize }, (_, i) => {
                const bitIndex = wordSize - 1 - i;
                const isOne = (val & (1n << BigInt(bitIndex))) !== 0n;
                const isNibbleBoundary = bitIndex % 4 === 0;
                return `
                  <button class="bit-toggle-btn ${isOne ? 'bit-active' : ''}" data-bit="${bitIndex}" 
                          title="Bit ${bitIndex} (وزن 2^${bitIndex})" 
                          style="width: 28px; height: 34px; padding: 0; font-family: monospace; font-size: 12px; font-weight: bold; border-radius: 4px; border: 1px solid ${isOne ? 'var(--accent-blue)' : 'var(--border-subtle)'}; background: ${isOne ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0,0,0,0.3)'}; color: ${isOne ? '#38bdf8' : '#64748b'}; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; ${isNibbleBoundary && bitIndex !== 0 ? 'margin-right: 6px;' : ''}">
                    <span>${isOne ? '1' : '0'}</span>
                    <span style="font-size: 8px; color: var(--text-muted);">${bitIndex}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Calculator Keypad -->
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--space-2);">
            <!-- Bitwise Operators Row -->
            <button class="btn btn-secondary calc-key" data-op="AND" style="font-weight: 700; font-size: 12px;">AND (&)</button>
            <button class="btn btn-secondary calc-key" data-op="OR" style="font-weight: 700; font-size: 12px;">OR (|)</button>
            <button class="btn btn-secondary calc-key" data-op="XOR" style="font-weight: 700; font-size: 12px;">XOR (^)</button>
            <button class="btn btn-secondary calc-key" data-op="NOT" style="font-weight: 700; font-size: 12px;">NOT (~)</button>
            <button class="btn btn-danger calc-key" data-act="CLEAR" style="font-weight: 700; font-size: 12px;">مسح (C)</button>

            <!-- Shift & Math Row -->
            <button class="btn btn-secondary calc-key" data-op="LSH" style="font-weight: 700; font-size: 12px;">Lsh (&lt;&lt;)</button>
            <button class="btn btn-secondary calc-key" data-op="RSH" style="font-weight: 700; font-size: 12px;">Rsh (&gt;&gt;)</button>
            <button class="btn btn-secondary calc-key" data-op="MOD" style="font-weight: 700; font-size: 12px;">Mod (%)</button>
            <button class="btn btn-secondary calc-key" data-op="DIV" style="font-weight: 700; font-size: 14px;">÷</button>
            <button class="btn btn-secondary calc-key" data-act="BACKSPACE" style="font-weight: 700; font-size: 14px;">⌫ حذف</button>

            <!-- Digits & Hex Keys -->
            <button class="btn btn-outline calc-digit ${['OCT','BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="A">A</button>
            <button class="btn btn-outline calc-digit ${['OCT','BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="B">B</button>
            <button class="btn btn-secondary calc-digit ${['BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="7">7</button>
            <button class="btn btn-secondary calc-digit ${['BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="8">8</button>
            <button class="btn btn-secondary calc-digit ${['BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="9">9</button>

            <button class="btn btn-outline calc-digit ${['OCT','BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="C">C</button>
            <button class="btn btn-outline calc-digit ${['OCT','BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="D">D</button>
            <button class="btn btn-secondary calc-digit ${['BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="4">4</button>
            <button class="btn btn-secondary calc-digit ${['BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="5">5</button>
            <button class="btn btn-secondary calc-digit ${['BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="6">6</button>

            <button class="btn btn-outline calc-digit ${['OCT','BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="E">E</button>
            <button class="btn btn-outline calc-digit ${['OCT','BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="F">F</button>
            <button class="btn btn-secondary calc-digit" data-val="1">1</button>
            <button class="btn btn-secondary calc-digit ${['BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="2">2</button>
            <button class="btn btn-secondary calc-digit ${['BIN'].includes(currentBase) ? 'disabled' : ''}" data-val="3">3</button>

            <!-- Bottom Row: 0, Math, Equals -->
            <button class="btn btn-secondary calc-op" data-op="MUL" style="font-weight: 700; font-size: 16px;">×</button>
            <button class="btn btn-secondary calc-op" data-op="SUB" style="font-weight: 700; font-size: 16px;">−</button>
            <button class="btn btn-secondary calc-digit" data-val="0" style="font-weight: 700; font-size: 16px;">0</button>
            <button class="btn btn-secondary calc-op" data-op="ADD" style="font-weight: 700; font-size: 16px;">+</button>
            <button class="btn btn-primary calc-act" data-act="EQUALS" style="font-weight: 800; font-size: 18px;">=</button>
          </div>
        </div>
      `;

      // Word size listeners
      container.querySelectorAll('.calc-word-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          wordSize = Number(btn.getAttribute('data-size'));
          currentValue = currentValue & getMask();
          render();
        });
      });

      // Base select listeners
      container.querySelectorAll('.calc-base-row').forEach((row) => {
        row.addEventListener('click', () => {
          currentBase = row.getAttribute('data-set-base');
          freshEntry = true;
          render();
        });
      });

      // Bit toggle listeners
      container.querySelectorAll('.bit-toggle-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const bitIndex = BigInt(btn.getAttribute('data-bit'));
          currentValue = currentValue ^ (1n << bitIndex);
          freshEntry = false;
          render();
        });
      });

      // Digit clicks
      container.querySelectorAll('.calc-digit').forEach((btn) => {
        btn.addEventListener('click', () => {
          const char = btn.getAttribute('data-val');
          if (!char) return;

          let baseRadix = 10;
          if (currentBase === 'HEX') baseRadix = 16;
          else if (currentBase === 'OCT') baseRadix = 8;
          else if (currentBase === 'BIN') baseRadix = 2;

          let currentStr = freshEntry ? '' : currentValue.toString(baseRadix);
          currentStr += char;

          try {
            currentValue = BigInt('0x' + (baseRadix === 16 ? currentStr : parseInt(currentStr, baseRadix).toString(16))) & getMask();
            freshEntry = false;
            render();
          } catch (e) {
            console.warn('Invalid digit entry:', e);
          }
        });
      });

      // Operation clicks
      container.querySelectorAll('[data-op]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const op = btn.getAttribute('data-op');
          if (op === 'NOT') {
            currentValue = (~currentValue) & getMask();
            freshEntry = true;
            render();
            return;
          }

          if (storedValue !== null && pendingOp) {
            executePending();
          }

          storedValue = currentValue;
          pendingOp = op;
          freshEntry = true;
          render();
        });
      });

      // Action clicks (CLEAR, BACKSPACE, EQUALS)
      container.querySelectorAll('[data-act]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const act = btn.getAttribute('data-act');
          if (act === 'CLEAR') {
            currentValue = 0n;
            storedValue = null;
            pendingOp = null;
            freshEntry = true;
            render();
          } else if (act === 'BACKSPACE') {
            const mask = getMask();
            let baseRadix = currentBase === 'HEX' ? 16 : currentBase === 'OCT' ? 8 : currentBase === 'BIN' ? 2 : 10;
            let str = currentValue.toString(baseRadix);
            str = str.slice(0, -1);
            if (!str) str = '0';
            currentValue = BigInt(parseInt(str, baseRadix)) & mask;
            render();
          } else if (act === 'EQUALS') {
            executePending();
            pendingOp = null;
            storedValue = null;
            freshEntry = true;
            render();
          }
        });
      });
    };

    const executePending = () => {
      if (storedValue === null || !pendingOp) return;
      const mask = getMask();
      const a = storedValue;
      const b = currentValue;

      switch (pendingOp) {
        case 'ADD': currentValue = (a + b) & mask; break;
        case 'SUB': currentValue = (a - b) & mask; break;
        case 'MUL': currentValue = (a * b) & mask; break;
        case 'DIV': currentValue = b !== 0n ? (a / b) & mask : 0n; break;
        case 'MOD': currentValue = b !== 0n ? (a % b) & mask : 0n; break;
        case 'AND': currentValue = (a & b) & mask; break;
        case 'OR': currentValue = (a | b) & mask; break;
        case 'XOR': currentValue = (a ^ b) & mask; break;
        case 'LSH': currentValue = (a << (b & 63n)) & mask; break;
        case 'RSH': currentValue = (a >> (b & 63n)) & mask; break;
      }
    };

    render();
  },

  /* ========================================================
     SCREEN L: CAPSTONE CHALLENGE (مشروع التحدي الختامي الشامل)
  ======================================================== */
  async renderCapstoneProject(projectId) {
    const main = document.getElementById('app-main-viewport');
    const student = State.currentStudent;

    let project = State.projectsMap.get('proj-pf1-capstone');
    if (!project) {
      try {
        const res = await fetch('/content/programming-foundations-level-1/projects/capstone-challenge.json');
        if (res.ok) {
          project = await res.json();
          State.projectsMap.set(project.id, project);
        }
      } catch (e) {
        console.warn('Failed to load project from disk:', e);
      }
    }

    if (!project) {
      main.innerHTML = `<div class="card" style="padding: var(--space-8); text-align: center;"><h2>المشروع غير متوفر حالياً</h2><a href="#curriculum" class="btn btn-primary">العودة للمناهج</a></div>`;
      return;
    }

    // Retrieve saved answers and completed tasks
    const storageKey = `capstone_${student ? student.id : 'guest'}_${project.id}`;
    let savedProgress = JSON.parse(localStorage.getItem(storageKey) || '{"completedTasks": [], "answers": {}}');

    const completedCount = savedProgress.completedTasks.length;
    const totalTasks = project.tasks.length;
    const progressPercent = Math.round((completedCount / totalTasks) * 100);

    main.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6);">
        <!-- Breadcrumb -->
        <div class="breadcrumb-nav">
          <a href="#curriculum">المناهج الدراسية</a>
          <span>/</span>
          <a href="#course/programming-foundations-level-1">أساسيات البرمجة (Level 1)</a>
          <span>/</span>
          <span style="color: var(--text-primary);">${project.title}</span>
        </div>

        <!-- Hero Card -->
        <div class="card" style="padding: var(--space-6); background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(56, 189, 248, 0.08)); border: 1px solid rgba(99, 102, 241, 0.35);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-4); margin-bottom: var(--space-4);">
            <div>
              <span class="badge badge-accent" style="font-size: 11px; margin-bottom: var(--space-2);">المشروع التطبيقي الختامي الشامل (Capstone Project)</span>
              <h1 style="font-size: var(--text-2xl); font-weight: 800; color: #FFFFFF; margin: var(--space-2) 0;">${project.title}</h1>
              <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6; max-width: 680px;">
                ${project.description}
              </p>
            </div>

            <div style="text-align: left; background: var(--bg-surface); padding: var(--space-4) var(--space-6); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
              <div style="font-size: var(--text-xs); color: var(--text-muted);">نسبة إنجاز المهام</div>
              <div style="font-size: var(--text-2xl); font-weight: 800; color: var(--accent-blue);">${progressPercent}%</div>
              <div style="font-size: var(--text-xs); color: var(--text-secondary);">${completedCount} من ${totalTasks} مهام</div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="progress-bar" style="height: 8px;">
            <div class="progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <!-- Tasks List -->
        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-2);">
            <h2 style="font-size: var(--text-lg); font-weight: 700;">مهام التحدي الإحدى عشرة (11 Tasks)</h2>
            <span style="font-size: var(--text-xs); color: var(--text-muted);">قم بحل كل مسألة ثم تحقق من الحل النموذجي واعتمد الإنجاز</span>
          </div>

          ${project.tasks.map((task, idx) => {
            const isCompleted = savedProgress.completedTasks.includes(task.id);
            const savedAnswer = savedProgress.answers[task.id] || '';
            return `
              <div class="card" style="padding: var(--space-5); border: 1px solid ${isCompleted ? 'rgba(74, 222, 128, 0.3)' : 'var(--border-subtle)'}; background: ${isCompleted ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-surface)'};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2);">
                  <div style="display: flex; align-items: center; gap: var(--space-3);">
                    <div class="stat-icon-wrapper ${isCompleted ? 'stat-icon-emerald' : 'stat-icon-blue'}" style="width: 32px; height: 32px; font-weight: 800;">
                      ${task.number}
                    </div>
                    <h3 style="font-size: var(--text-base); font-weight: 700; margin: 0;">${task.title}</h3>
                  </div>

                  <span class="badge ${isCompleted ? 'badge-primary' : 'badge-secondary'}" style="font-size: 11px;">
                    ${isCompleted ? 'مكتمل بنجاح ✓' : 'قيد الحل ⏳'}
                  </span>
                </div>

                <div style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-4); background: rgba(0,0,0,0.25); padding: var(--space-4); border-radius: var(--radius-md); border-right: 3px solid var(--accent-indigo);">
                  ${this.escapeHtml(task.instructions).replace(/\\n/g, '<br/>')}
                </div>

                <!-- Student Answer Input Area -->
                <div style="margin-bottom: var(--space-4);">
                  <label style="display: block; font-size: var(--text-xs); font-weight: 600; color: var(--text-secondary); margin-bottom: var(--space-2);">
                    إجابتك أو خطوات الحل البرمجية:
                  </label>
                  <textarea class="task-answer-input" data-task-id="${task.id}" rows="3" placeholder="اكتب إجابتك أو ملاحظاتك هنا..." style="width: 100%;">${this.escapeHtml(savedAnswer)}</textarea>
                </div>

                <!-- Solution Reveal Accordion -->
                <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center;">
                  <button class="btn btn-outline btn-sm toggle-solution-btn" data-target="sol-${task.id}">
                    🔍 استعراض الحل النموذجي والتحقق
                  </button>

                  <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'} btn-sm mark-task-btn" data-task-id="${task.id}">
                    ${isCompleted ? 'إلغاء الاعتماد' : 'اعتماد المهمة كمنجزة ✓'}
                  </button>
                </div>

                <div id="sol-${task.id}" class="task-solution-box hidden" style="margin-top: var(--space-4); padding: var(--space-4); background: rgba(30, 41, 59, 0.7); border-radius: var(--radius-md); border-right: 3px solid var(--accent-blue);">
                  <h4 style="font-size: var(--text-xs); font-weight: 700; color: var(--accent-blue); margin-bottom: var(--space-2);">الحل النموذجي والتفسير العلمي:</h4>
                  <pre style="font-family: monospace; font-size: var(--text-xs); color: #cbd5e1; white-space: pre-wrap; line-height: 1.6; margin: 0; direction: rtl; text-align: right;"><code>${this.escapeHtml(task.solution)}</code></pre>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Final Submission & XP Award -->
        <div class="card" style="padding: var(--space-6); text-align: center; background: linear-gradient(135deg, rgba(16, 22, 38, 0.95), rgba(23, 33, 56, 0.95)); border: 1px solid rgba(99, 102, 241, 0.4);">
          <h3 style="font-size: var(--text-xl); font-weight: 800; color: #FFFFFF; margin-bottom: var(--space-2);">
            ${completedCount === totalTasks ? '🎉 مبروك! أتممت جميع مهام التحدي الشامل بنجاح!' : 'واصل التقدم لإتمام التحدي كاملاً'}
          </h3>
          <p style="font-size: var(--text-sm); color: var(--text-secondary); max-width: 600px; margin: 0 auto var(--space-4);">
            ${completedCount === totalTasks ? 'لقد برهنت على فهم راسخ لأساسيات علوم الحاسوب ومعمارية المعالجة والأنظمة الرقمية وأنت الآن مؤهل تماماً للمستوى التالي.' : `أكملت ${completedCount} من أصل ${totalTasks} مهام. اعتمد بقية المهام للحصول على شارة بطل الأساسيات.`}
          </p>

          ${completedCount === totalTasks ? `
            <button id="claim-capstone-btn" class="btn btn-primary btn-lg" style="margin: 0 auto;">
              🏆 اعتماد التحدي وحصد +150 نقطة XP
            </button>
          ` : `
            <a href="#curriculum" class="btn btn-outline">العودة لقائمة المناهج</a>
          `}
        </div>
      </div>
    `;

    // Solution toggles
    main.querySelectorAll('.toggle-solution-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const box = document.getElementById(targetId);
        if (box) {
          box.classList.toggle('hidden');
        }
      });
    });

    // Save answer inputs
    main.querySelectorAll('.task-answer-input').forEach((input) => {
      input.addEventListener('change', () => {
        const taskId = input.getAttribute('data-task-id');
        savedProgress.answers[taskId] = input.value;
        localStorage.setItem(storageKey, JSON.stringify(savedProgress));
      });
    });

    // Mark task done buttons
    main.querySelectorAll('.mark-task-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-task-id');
        if (savedProgress.completedTasks.includes(taskId)) {
          savedProgress.completedTasks = savedProgress.completedTasks.filter(id => id !== taskId);
        } else {
          savedProgress.completedTasks.push(taskId);
        }
        localStorage.setItem(storageKey, JSON.stringify(savedProgress));
        this.renderCapstoneProject(projectId);
      });
    });

    // Claim capstone reward
    const claimBtn = document.getElementById('claim-capstone-btn');
    if (claimBtn && student) {
      claimBtn.addEventListener('click', async () => {
        await StudentManager.awardPoints(150, 'إتمام مشروع تحدي أساسيات الحاسوب الشامل');
        await AchievementEngine.checkAndUnlock(student.id, 'badge_quiz_master');
        this.showToast('تهانينا! حصلت على +150 XP وشارة إتمام أساسيات الحاسوب!', 'success');
        Router.navigate('#achievements');
      });
    }
  },

  escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
