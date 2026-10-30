/**
 * Programming Academy - CodeMirror 6 Local Editor & Sandboxed Runner
 */

import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorState, Compartment } from '@codemirror/state';
import { DB } from './database.js';
import { State } from './state.js';
import { AchievementEngine } from './achievement-engine.js';

export const EditorEngine = {
  activeView: null,
  activeLanguage: 'javascript', // 'html' | 'css' | 'javascript'
  languageCompartment: new Compartment(),
  
  // Multi-tab code buffers
  buffers: {
    html: `<!-- جرب كتابة عناصر HTML هنا -->\n<div class="card">\n  <h2>أكاديمية البرمجة</h2>\n  <p>أول مشروع تجريبي لي في المختبر البرمجي!</p>\n  <button id="actionBtn">اضغط هنا</button>\n</div>`,
    css: `/* نسق العناصر عبر CSS */\nbody {\n  font-family: system-ui, sans-serif;\n  background: #0f172a;\n  color: #f8fafc;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n}\n\n.card {\n  background: #1e293b;\n  padding: 24px;\n  border-radius: 12px;\n  box-shadow: 0 4px 16px rgba(0,0,0,0.3);\n  text-align: center;\n}\n\nbutton {\n  background: #38bdf8;\n  color: #0f172a;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  font-weight: bold;\n  cursor: pointer;\n}`,
    javascript: `// اكتب كود التفاعل المنطقي بجافاسكريبت\nconsole.log("مرحباً بك في المختبر البرمجي!");\n\nconst btn = document.getElementById("actionBtn");\nif (btn) {\n  btn.addEventListener("click", () => {\n    console.log("تم النقر على الزر بنجاح! 🚀");\n    alert("أحسنت! الكود التفاعلي يعمل بنجاح.");\n  });\n}`
  },

  consoleLogs: [],

  /**
   * Initialize CodeMirror instance inside container
   */
  initEditor(containerElement, initialLanguage = 'javascript', initialCode = null) {
    if (!containerElement) return;

    if (this.activeView) {
      this.activeView.destroy();
      this.activeView = null;
    }

    this.activeLanguage = initialLanguage;
    if (initialCode !== null) {
      this.buffers[initialLanguage] = initialCode;
    }

    const langExtension = this.getLanguageExtension(initialLanguage);

    const startState = EditorState.create({
      doc: this.buffers[initialLanguage] || '',
      extensions: [
        basicSetup,
        oneDark,
        this.languageCompartment.of(langExtension),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            this.buffers[this.activeLanguage] = update.state.doc.toString();
          }
        }),
        EditorView.lineWrapping
      ]
    });

    this.activeView = new EditorView({
      state: startState,
      parent: containerElement
    });

    this.setupConsoleMessageListener();
  },

  /**
   * Switch active code editor tab (HTML, CSS, JS)
   */
  switchTab(language) {
    if (!this.activeView || !this.buffers[language] !== undefined) return;

    // Save current buffer
    this.buffers[this.activeLanguage] = this.activeView.state.doc.toString();
    this.activeLanguage = language;

    const langExtension = this.getLanguageExtension(language);
    const newDoc = this.buffers[language];

    this.activeView.dispatch({
      changes: { from: 0, to: this.activeView.state.doc.length, insert: newDoc },
      effects: this.languageCompartment.reconfigure(langExtension)
    });
  },

  /**
   * Get language mode extension
   */
  getLanguageExtension(lang) {
    switch (lang) {
      case 'html': return html();
      case 'css': return css();
      case 'javascript':
      default:
        return javascript();
    }
  },

  /**
   * Set editor code directly
   */
  setCode(code, language = null) {
    if (language && language !== this.activeLanguage) {
      this.switchTab(language);
    }
    if (this.activeView) {
      this.activeView.dispatch({
        changes: { from: 0, to: this.activeView.state.doc.length, insert: code }
      });
      this.buffers[this.activeLanguage] = code;
    }
  },

  /**
   * Get current editor code
   */
  getCode() {
    return this.activeView ? this.activeView.state.doc.toString() : this.buffers[this.activeLanguage];
  },

  /**
   * Reset current buffer or all buffers to initial state
   */
  resetCode() {
    const defaults = {
      html: `<!-- جرب كتابة عناصر HTML هنا -->\n<div class="card">\n  <h2>أكاديمية البرمجة</h2>\n  <p>أول مشروع تجريبي لي في المختبر البرمجي!</p>\n  <button id="actionBtn">اضغط هنا</button>\n</div>`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  background: #0f172a;\n  color: #f8fafc;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n}\n.card {\n  background: #1e293b;\n  padding: 24px;\n  border-radius: 12px;\n  text-align: center;\n}\nbutton {\n  background: #38bdf8;\n  color: #0f172a;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 6px;\n  cursor: pointer;\n}`,
      javascript: `console.log("تمت إعادة ضبط المختبر البرمجي.");`
    };

    this.buffers = { ...defaults };
    this.setCode(this.buffers[this.activeLanguage]);
    this.clearConsole();
  },

  /**
   * Load a starter sample project
   */
  loadSample(templateName) {
    if (templateName === 'counter') {
      this.buffers.html = `<div class="counter-box">\n  <h1 id="count">0</h1>\n  <div class="btns">\n    <button id="dec">-</button>\n    <button id="reset">0</button>\n    <button id="inc">+</button>\n  </div>\n</div>`;
      this.buffers.css = `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #0b101b; color: white; font-family: sans-serif; margin: 0; }\n.counter-box { text-align: center; background: #151d30; padding: 32px; border-radius: 16px; border: 1px solid #233152; }\n#count { font-size: 4rem; margin: 0 0 16px; color: #38bdf8; }\n.btns { display: flex; gap: 8px; justify-content: center; }\nbutton { font-size: 1.5rem; width: 50px; height: 50px; border-radius: 8px; border: none; background: #3b82f6; color: white; cursor: pointer; }\nbutton:hover { background: #2563eb; }`;
      this.buffers.javascript = `let c = 0;\nconst display = document.getElementById("count");\n\ndocument.getElementById("inc").onclick = () => { c++; display.textContent = c; console.log("العداد: " + c); };\ndocument.getElementById("dec").onclick = () => { c--; display.textContent = c; console.log("العداد: " + c); };\ndocument.getElementById("reset").onclick = () => { c = 0; display.textContent = c; console.log("تم تصفير العداد"); };`;
    } else if (templateName === 'clock') {
      this.buffers.html = `<div class="clock-card">\n  <div id="time">00:00:00</div>\n  <div id="date">التاريخ</div>\n</div>`;
      this.buffers.css = `body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #060913; font-family: monospace; margin: 0; }\n.clock-card { background: #131b2e; padding: 30px; border-radius: 20px; border: 1px solid #1e293b; text-align: center; }\n#time { font-size: 3rem; color: #34d399; font-weight: bold; letter-spacing: 2px; }\n#date { margin-top: 10px; color: #94a3b8; font-size: 1rem; }`;
      this.buffers.javascript = `function update() {\n  const now = new Date();\n  document.getElementById("time").textContent = now.toLocaleTimeString();\n  document.getElementById("date").textContent = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });\n}\nsetInterval(update, 1000);\nupdate();\nconsole.log("تم تشغيل الساعة الرقمية بنجاح ⏱️");`;
    }

    this.setCode(this.buffers[this.activeLanguage]);
    this.runCode();
  },

  /**
   * Execute code in sandboxed iframe with strict isolation
   */
  runCode(iframeElement = null) {
    const iframe = iframeElement || document.getElementById('playground-preview-frame');
    if (!iframe) return;

    // Flush current view into buffer
    if (this.activeView) {
      this.buffers[this.activeLanguage] = this.activeView.state.doc.toString();
    }

    this.clearConsole();

    // Sandboxed HTML document containing console interceptor script
    const bundleHtml = `
      <!DOCTYPE html>
      <html lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            ${this.buffers.css}
          </style>
        </head>
        <body>
          ${this.buffers.html}
          <script>
            (function() {
              // Intercept console messages and transmit to parent
              const sendLog = (level, args) => {
                try {
                  const msg = args.map(arg => {
                    if (typeof arg === 'object') {
                      try { return JSON.stringify(arg); } catch(e) { return String(arg); }
                    }
                    return String(arg);
                  }).join(' ');
                  window.parent.postMessage({ type: 'PLAYGROUND_CONSOLE', level, message: msg }, '*');
                } catch(err) {}
              };

              console.log = (...args) => sendLog('info', args);
              console.warn = (...args) => sendLog('warn', args);
              console.error = (...args) => sendLog('error', args);

              window.onerror = function(message, source, lineno, colno, error) {
                sendLog('error', ['خطأ برمجي (سطر ' + lineno + '): ' + message]);
                return false;
              };
            })();
          <\/script>
          <script>
            try {
              ${this.buffers.javascript}
            } catch(e) {
              console.error("خطأ تشغيلي: " + e.message);
            }
          <\/script>
        </body>
      </html>
    `;

    iframe.srcdoc = bundleHtml;

    if (State.currentStudent) {
      AchievementEngine.checkAndUnlock(State.currentStudent.id, 'badge_code_runner');
    }
  },

  /**
   * Listen for sandboxed postMessage console events
   */
  setupConsoleMessageListener() {
    if (this._listenerBound) return;
    this._listenerBound = true;

    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'PLAYGROUND_CONSOLE') {
        this.addConsoleLog(event.data.level, event.data.message);
      }
    });
  },

  addConsoleLog(level, message) {
    const logItem = { level, message, time: new Date().toLocaleTimeString() };
    this.consoleLogs.push(logItem);
    
    const logsContainer = document.getElementById('playground-console-list');
    if (logsContainer) {
      const el = document.createElement('div');
      el.className = `console-log-entry ${level}`;
      el.innerHTML = `<span style="opacity: 0.5;">[${logItem.time}]</span> <span>${this.escapeHtml(message)}</span>`;
      logsContainer.appendChild(el);
      logsContainer.scrollTop = logsContainer.scrollHeight;
    }
  },

  clearConsole() {
    this.consoleLogs = [];
    const logsContainer = document.getElementById('playground-console-list');
    if (logsContainer) logsContainer.innerHTML = '';
  },

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  /**
   * Save playground project locally in IndexedDB
   */
  async saveProject(projectName = 'مشروعي البرمجي') {
    if (!State.currentStudent) return null;
    const project = {
      id: 'proj_' + Date.now(),
      studentId: State.currentStudent.id,
      title: projectName.trim() || 'مشروع برمجي جديد',
      buffers: { ...this.buffers },
      updatedAt: new Date().toISOString()
    };
    await DB.put('savedCode', project);
    State.notify('project-saved', project);
    return project;
  },

  /**
   * Load saved projects for student
   */
  async getSavedProjects(studentId) {
    if (!studentId) return [];
    return await DB.getAllByIndex('savedCode', 'studentId', studentId);
  }
};
