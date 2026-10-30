/**
 * Programming Academy - Notes & Bookmarks Engine
 */

import { DB } from './database.js';
import { State } from './state.js';
import { AchievementEngine } from './achievement-engine.js';

export const NotesEngine = {
  /**
   * Save or update a note
   */
  async saveNote({ id, studentId, lessonId, lessonTitle, content }) {
    if (!studentId || !content.trim()) return null;

    const noteId = id || 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const note = {
      id: noteId,
      studentId,
      lessonId: lessonId || null,
      lessonTitle: lessonTitle || 'ملاحظة عامة',
      content: content.trim(),
      updatedAt: new Date().toISOString()
    };

    await DB.put('notes', note);
    await AchievementEngine.checkAndUnlock(studentId, 'badge_note_taker');
    State.notify('notes-updated', note);
    return note;
  },

  /**
   * Delete a note
   */
  async deleteNote(noteId) {
    await DB.delete('notes', noteId);
    State.notify('notes-updated', { deletedId: noteId });
    return true;
  },

  /**
   * Get all notes for a student, with optional search query
   */
  async getNotes(studentId, searchQuery = '') {
    if (!studentId) return [];
    const allNotes = await DB.getAllByIndex('notes', 'studentId', studentId);
    
    // Sort descending by updatedAt
    allNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    if (!searchQuery.trim()) return allNotes;

    const q = searchQuery.toLowerCase().trim();
    return allNotes.filter(
      (n) => n.content.toLowerCase().includes(q) || (n.lessonTitle && n.lessonTitle.toLowerCase().includes(q))
    );
  },

  /**
   * Get all bookmarked lessons
   */
  async getBookmarks(studentId) {
    if (!studentId) return [];
    return await DB.getAllByIndex('bookmarks', 'studentId', studentId);
  }
};
