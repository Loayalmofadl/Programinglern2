/**
 * Programming Academy - Centralized State Manager
 */

export const State = {
  currentStudent: null,
  activeRoute: 'dashboard',
  routeParams: {},
  curriculum: null,
  lessonsMap: new Map(),
  quizzesMap: new Map(),
  exercisesMap: new Map(),
  projectsMap: new Map(),
  
  // Settings
  theme: 'dark',
  fontSize: 'normal',
  dailyGoalMinutes: 20,
  
  // Listeners
  listeners: new Set(),

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  notify(event, data) {
    this.listeners.forEach((listener) => {
      try {
        listener(event, data);
      } catch (err) {
        console.error('State listener error:', err);
      }
    });
  },

  setCurrentStudent(student) {
    this.currentStudent = student;
    if (student) {
      localStorage.setItem('programming_academy_active_student_id', student.id);
    } else {
      localStorage.removeItem('programming_academy_active_student_id');
    }
    this.notify('student-changed', student);
  },

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('programming_academy_theme', theme);
    this.notify('theme-changed', theme);
  },

  setFontSize(size) {
    this.fontSize = size;
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('programming_academy_font_size', size);
    this.notify('font-size-changed', size);
  }
};
