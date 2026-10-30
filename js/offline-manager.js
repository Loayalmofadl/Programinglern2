/**
 * Programming Academy - Offline Manager & PWA Integration
 */

import { State } from './state.js';

let deferredInstallPrompt = null;

export const OfflineManager = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isInstallable: false,
  isInstalled: false,
  isIOS: false,

  /**
   * Initialize Service Worker and PWA install events
   */
  async init() {
    // Detect iOS
    const ua = navigator.userAgent.toLowerCase();
    this.isIOS = /iphone|ipad|ipod/.test(ua);

    // Detect standalone PWA mode
    this.isInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const reg = await navigator.serviceWorker.register('/service-worker.js');
          console.log('[OfflineManager] ServiceWorker registered with scope:', reg.scope);
        } catch (err) {
          console.warn('[OfflineManager] ServiceWorker registration skipped or failed:', err);
        }
      });
    }

    // Network Connectivity listeners
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateOfflineUI();
      State.notify('connectivity-changed', { isOnline: true });
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateOfflineUI();
      State.notify('connectivity-changed', { isOnline: false });
    });

    // PWA Install Prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      this.isInstallable = true;
      this.updateInstallButtonUI();
      State.notify('pwa-installable', true);
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.isInstallable = false;
      deferredInstallPrompt = null;
      this.updateInstallButtonUI();
      State.notify('pwa-installed', true);
    });

    this.updateOfflineUI();
  },

  /**
   * Trigger PWA installation
   */
  async promptInstall() {
    if (!deferredInstallPrompt) {
      if (this.isIOS) {
        return 'ios-guide';
      }
      return false;
    }

    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    this.isInstallable = false;
    this.updateInstallButtonUI();
    return outcome === 'accepted';
  },

  /**
   * Update visual offline indicators
   */
  updateOfflineUI() {
    const banner = document.getElementById('offline-status-indicator');
    if (!banner) return;

    if (!this.isOnline) {
      banner.classList.remove('hidden');
      banner.innerHTML = `
        <span class="status-dot"></span>
        <span>وضع عدم الاتصال (Offline) — جميع الدروس والمحرر متاحة محلياً</span>
      `;
      banner.className = 'offline-pill';
    } else {
      banner.innerHTML = `
        <span class="status-dot"></span>
        <span>متصل محلياً — جاهز للعمل بدون إنترنت</span>
      `;
      banner.className = 'online-pill';
    }
  },

  /**
   * Update install button visibility
   */
  updateInstallButtonUI() {
    const installBtns = document.querySelectorAll('.pwa-install-trigger');
    installBtns.forEach((btn) => {
      if (this.isInstalled) {
        btn.classList.add('hidden');
      } else if (this.isInstallable || this.isIOS) {
        btn.classList.remove('hidden');
      }
    });
  },

  /**
   * Get local storage estimation in MB
   */
  async getStorageEstimate() {
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        const usageMB = Math.round(((estimate.usage || 0) / (1024 * 1024)) * 10) / 10;
        const quotaMB = Math.round(((estimate.quota || 0) / (1024 * 1024)) * 10) / 10;
        return { usageMB, quotaMB };
      } catch (e) {
        return { usageMB: 0, quotaMB: 0 };
      }
    }
    return { usageMB: 0, quotaMB: 0 };
  }
};
