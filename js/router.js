/**
 * Programming Academy - Lightweight Client-Side Router
 * Supports SPA navigation without reloads and browser back/forward history
 */

import { State } from './state.js';

export const Router = {
  routes: {},
  
  init(routes) {
    this.routes = routes;

    window.addEventListener('hashchange', () => {
      this.handleRoute();
    });

    // Handle initial load
    this.handleRoute();
  },

  navigate(hash) {
    if (!hash.startsWith('#')) hash = '#' + hash;
    window.location.hash = hash;
  },

  handleRoute() {
    let hash = window.location.hash || '#dashboard';
    if (hash.startsWith('#/')) hash = '#' + hash.slice(2);
    if (!hash.startsWith('#')) hash = '#' + hash;

    // Clean hash
    const path = hash.slice(1); // e.g. "dashboard", "lesson/lesson-101"
    const segments = path.split('/');
    const rootRoute = segments[0] || 'dashboard';

    // Check if student exists; if not, force #welcome
    if (!State.currentStudent && rootRoute !== 'welcome') {
      window.location.hash = '#welcome';
      return;
    }

    State.activeRoute = rootRoute;
    State.routeParams = {
      id: segments[1] || null,
      subId: segments[2] || null
    };

    // Update active nav links in sidebar and mobile nav
    this.updateActiveNavLinks(rootRoute);

    // Call route handler
    const handler = this.routes[rootRoute] || this.routes['dashboard'];
    if (typeof handler === 'function') {
      handler(State.routeParams);
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
  },

  updateActiveNavLinks(activeRoute) {
    // Map sub-routes to main tabs
    let mainTab = activeRoute;
    if (activeRoute === 'course' || activeRoute === 'lesson' || activeRoute === 'quiz' || activeRoute === 'exercise') {
      mainTab = 'curriculum';
    } else if (activeRoute === 'profile') {
      mainTab = 'settings';
    }

    document.querySelectorAll('[data-route]').forEach((link) => {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === mainTab) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
};
