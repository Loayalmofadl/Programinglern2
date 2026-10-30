/**
 * Programming Academy - IndexedDB Local Database
 * Versioned local persistence for offline-first architecture
 */

const DB_NAME = 'ProgrammingAcademyDB';
const DB_VERSION = 1;

let dbInstance = null;

export const DB = {
  /**
   * Initializes and opens IndexedDB with all structured object stores
   */
  async init() {
    if (dbInstance) return dbInstance;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 1. Students store
        if (!db.objectStoreNames.contains('students')) {
          const store = db.createObjectStore('students', { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // 2. Courses store (cached local curriculum)
        if (!db.objectStoreNames.contains('courses')) {
          const store = db.createObjectStore('courses', { keyPath: 'id' });
          store.createIndex('semesterId', 'semesterId', { unique: false });
        }

        // 3. Modules store
        if (!db.objectStoreNames.contains('modules')) {
          const store = db.createObjectStore('modules', { keyPath: 'id' });
          store.createIndex('courseId', 'courseId', { unique: false });
        }

        // 4. Lessons store
        if (!db.objectStoreNames.contains('lessons')) {
          const store = db.createObjectStore('lessons', { keyPath: 'id' });
          store.createIndex('courseId', 'courseId', { unique: false });
          store.createIndex('moduleId', 'moduleId', { unique: false });
        }

        // 5. LessonProgress store
        if (!db.objectStoreNames.contains('lessonProgress')) {
          const store = db.createObjectStore('lessonProgress', { keyPath: 'id' });
          store.createIndex('studentId', 'studentId', { unique: false });
          store.createIndex('lessonId', 'lessonId', { unique: false });
          store.createIndex('student_lesson', ['studentId', 'lessonId'], { unique: true });
        }

        // 6. QuizAttempts store
        if (!db.objectStoreNames.contains('quizAttempts')) {
          const store = db.createObjectStore('quizAttempts', { keyPath: 'id' });
          store.createIndex('studentId', 'studentId', { unique: false });
          store.createIndex('quizId', 'quizId', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 7. ExerciseAttempts store
        if (!db.objectStoreNames.contains('exerciseAttempts')) {
          const store = db.createObjectStore('exerciseAttempts', { keyPath: 'id' });
          store.createIndex('studentId', 'studentId', { unique: false });
          store.createIndex('exerciseId', 'exerciseId', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 8. Notes store
        if (!db.objectStoreNames.contains('notes')) {
          const store = db.createObjectStore('notes', { keyPath: 'id' });
          store.createIndex('studentId', 'studentId', { unique: false });
          store.createIndex('lessonId', 'lessonId', { unique: false });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // 9. Bookmarks store
        if (!db.objectStoreNames.contains('bookmarks')) {
          const store = db.createObjectStore('bookmarks', { keyPath: 'id' });
          store.createIndex('studentId', 'studentId', { unique: false });
          store.createIndex('lessonId', 'lessonId', { unique: false });
        }

        // 10. Achievements store
        if (!db.objectStoreNames.contains('achievements')) {
          const store = db.createObjectStore('achievements', { keyPath: 'id' });
          store.createIndex('studentId', 'studentId', { unique: false });
          store.createIndex('badgeId', 'badgeId', { unique: false });
        }

        // 11. Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        // 12. SavedCode store (playground projects)
        if (!db.objectStoreNames.contains('savedCode')) {
          const store = db.createObjectStore('savedCode', { keyPath: 'id' });
          store.createIndex('studentId', 'studentId', { unique: false });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = event.target.result;
        resolve(dbInstance);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        reject(event.target.error);
      };
    });
  },

  /**
   * Generic get by key
   */
  async get(storeName, key) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Generic get all items
   */
  async getAll(storeName) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Generic get all items matching an index
   */
  async getAllByIndex(storeName, indexName, value) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const req = index.getAll(value);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Generic put (insert/update)
   */
  async put(storeName, item) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Generic delete by key
   */
  async delete(storeName, key) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Clear an entire store
   */
  async clear(storeName) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }
};
