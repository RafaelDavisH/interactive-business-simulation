/**
 * BizSim App Engine
 * Exposes window.BizSim — the complete public API for the Business Simulation prototype.
 *
 * Depends on: window.BizSimData (data.js must be loaded first)
 */
(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────────
  // CONSTANTS
  // ─────────────────────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'bizSim';
  const TOTAL_MODULES = 4;

  /** @type {AppState} */
  const DEFAULT_STATE = {
    scenario: null,   // 'foodietrack' | 'healthbuddy' | 'devcollab'
    started: false,
    modules: {
      1: { completed: false, score: 0, answers: {} },
      2: { completed: false, score: 0, answers: {} },
      3: { completed: false, score: 0, answers: {} },
      4: { completed: false, score: 0, answers: {} },
    },
    totalScore: 0,
    badges: [],
  };

  // SVG ring circumference (2π × r where r = 40)
  const RING_CIRCUMFERENCE = 251;

  // ─────────────────────────────────────────────────────────────────────────────
  // INTERNAL UTILITIES
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Deep-merge two objects. Arrays are replaced, not merged.
   * Only goes one extra level deep for the `modules` sub-object.
   */
  function deepMerge(target, source) {
    const result = Object.assign({}, target);
    for (const key of Object.keys(source)) {
      if (
        source[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target[key] !== null &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  /**
   * Guard helper — returns el only if it exists, null otherwise.
   * @param {string} selector
   * @param {Element|Document} [root=document]
   */
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  /**
   * Guard helper — returns all matching elements.
   * @param {string} selector
   * @param {Element|Document} [root=document]
   */
  function $$(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  /**
   * Extract module number from a page filename like "module-2.html".
   * Returns null if not found.
   * @param {string} page
   * @returns {number|null}
   */
  function extractModuleNumber(page) {
    const match = page.match(/module-(\d+)\.html/i);
    return match ? parseInt(match[1], 10) : null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Returns the full state object from localStorage, falling back to DEFAULT_STATE.
   * @returns {AppState}
   */
  function getState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepMerge({}, DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      // Ensure modules sub-object always has all 4 keys (handles old saves)
      const state = deepMerge(deepMerge({}, DEFAULT_STATE), parsed);
      return state;
    } catch (e) {
      console.warn('[BizSim] Failed to parse stored state — using defaults.', e);
      return deepMerge({}, DEFAULT_STATE);
    }
  }

  /**
   * Deep-merges `partial` into current state and persists to localStorage.
   * @param {Partial<AppState>} partial
   * @returns {AppState} The new full state
   */
  function setState(partial) {
    const current = getState();
    const next = deepMerge(current, partial);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('[BizSim] Failed to persist state to localStorage.', e);
    }
    return next;
  }

  /**
   * Clears localStorage entry and redirects to index.html.
   */
  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('[BizSim] Could not clear localStorage.', e);
    }
    window.location.href = 'index.html';
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCENARIO
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Returns the current scenario object from BizSimData.scenarios.
   * @returns {object|null}
   */
  function getScenario() {
    const state = getState();
    if (!state.scenario) return null;
    return (window.BizSimData && window.BizSimData.scenarios[state.scenario]) || null;
  }

  /**
   * Sets the active scenario.
   * @param {string} id
   */
  function setScenario(id) {
    setState({ scenario: id });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Returns the state object for module n.
   * @param {number} n  1–4
   * @returns {{ completed: boolean, score: number, answers: object }}
   */
  function getModuleState(n) {
    const state = getState();
    return state.modules[n] || { completed: false, score: 0, answers: {} };
  }

  /**
   * Marks module n as complete, saves score + answers, awards badge, recalculates totalScore.
   * @param {number} n  1–4
   * @param {number} score
   * @param {object} answers
   */
  function completeModule(n, score, answers) {
    const state = getState();

    // Build updated modules object
    const updatedModules = deepMerge({}, state.modules);
    updatedModules[n] = {
      completed: true,
      score: score,
      answers: answers || {},
    };

    // Recalculate totalScore
    const totalScore = Object.values(updatedModules).reduce(
      (sum, m) => sum + (m.score || 0),
      0
    );

    // Award badge for this module if not already earned
    const data = window.BizSimData;
    let updatedBadges = [...(state.badges || [])];
    if (data && data.badges) {
      const badge = data.badges.find((b) => b.module === n);
      if (badge && !updatedBadges.includes(badge.id)) {
        updatedBadges.push(badge.id);
      }
    }

    setState({
      modules: updatedModules,
      totalScore,
      badges: updatedBadges,
    });
  }

  /**
   * Returns whether module n is accessible.
   * Module 1 is always accessible. N > 1 requires N-1 to be complete.
   * @param {number} n
   * @returns {boolean}
   */
  function canAccessModule(n) {
    if (n === 1) return true;
    const prev = getModuleState(n - 1);
    return prev.completed === true;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SCORING
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Returns the sum of all module scores.
   * @returns {number}
   */
  function getTotalScore() {
    const state = getState();
    return state.totalScore || 0;
  }

  /**
   * Returns the viability rating object matching the current totalScore.
   * Falls back to the lowest rating.
   * @returns {{ min: number, label: string, color: string, icon: string, description: string }}
   */
  function getViabilityRating() {
    const score = getTotalScore();
    const ratings =
      (window.BizSimData && window.BizSimData.viabilityRatings) || [];
    // Ratings are ordered highest to lowest; find first whose min is <= score
    for (const rating of ratings) {
      if (score >= rating.min) return rating;
    }
    return ratings[ratings.length - 1] || { min: 0, label: 'Unknown', color: 'secondary', icon: '❓', description: '' };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Navigates to a page, enforcing module access guards.
   * @param {string} page  e.g. 'module-2.html'
   */
  function navigate(page) {
    const moduleNum = extractModuleNumber(page);
    if (moduleNum !== null && !canAccessModule(moduleNum)) {
      showToast('Complete the previous module first', 'warning');
      return;
    }
    window.location.href = page;
  }

  /**
   * Navigates forward from the current module to the next, or to results.html after module 4.
   * @param {number} current  Current module number (1–4)
   */
  function goToNextModule(current) {
    if (current >= TOTAL_MODULES) {
      window.location.href = 'results.html';
    } else {
      navigate('module-' + (current + 1) + '.html');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UI — SIDEBAR
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Populates the sidebar with scenario pill, nav item statuses, and health ring.
   */
  function initSidebar() {
    const scenario = getScenario();

    // Scenario pill
    const pill = $('.sidebar-scenario-pill');
    if (pill && scenario) {
      pill.textContent = scenario.icon + ' ' + scenario.name;
      pill.style.backgroundColor = scenario.color + '22'; // light tint
      pill.style.color = scenario.color;
      pill.style.borderColor = scenario.color;
    }

    // Nav items
    const navItems = $$('.sidebar-nav-item[data-module]');
    navItems.forEach((item) => {
      const moduleNum = parseInt(item.getAttribute('data-module'), 10);
      const modState = getModuleState(moduleNum);

      // Remove existing status classes
      item.classList.remove('active', 'done', 'locked', 'is-active', 'is-done', 'is-locked');

      // Determine current page module
      const currentPage = window.location.pathname.split('/').pop();
      const currentModule = extractModuleNumber(currentPage);

      if (modState.completed) {
        item.classList.add('done');
        _setNavItemIcon(item, '✓');
      } else if (moduleNum === currentModule) {
        item.classList.add('active');
        _setNavItemIcon(item, '');
      } else if (!canAccessModule(moduleNum)) {
        item.classList.add('locked');
        _setNavItemIcon(item, '🔒');
      }

      // Attach click handler (guards are applied inside navigate())
      item.addEventListener('click', function (e) {
        e.preventDefault();
        const href = item.getAttribute('href') || item.dataset.href;
        if (href) navigate(href);
      });
    });

    // Health ring
    updateHealthRing(getTotalScore());
  }

  /**
   * Internal — sets a status icon inside a nav item without clobbering its label text.
   */
  function _setNavItemIcon(item, icon) {
    let iconEl = item.querySelector('.nav-status-icon');
    if (!iconEl) {
      iconEl = document.createElement('span');
      iconEl.className = 'nav-status-icon';
      item.appendChild(iconEl);
    }
    iconEl.textContent = icon;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UI — STEP INDICATOR
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Renders step dot indicators.
   * Dots before current are marked done; current is active.
   * @param {number} totalSteps
   * @param {number} currentStep  1-indexed
   */
  function initStepIndicator(totalSteps, currentStep) {
    const container = $('.step-indicator');
    if (!container) return;

    container.innerHTML = '';

    for (let i = 1; i <= totalSteps; i++) {
      const dot = document.createElement('div');
      dot.className = 'step-dot';

      if (i < currentStep) {
        dot.classList.add('step-dot--done');
        dot.setAttribute('aria-label', 'Step ' + i + ': complete');
      } else if (i === currentStep) {
        dot.classList.add('step-dot--active');
        dot.setAttribute('aria-current', 'step');
        dot.setAttribute('aria-label', 'Step ' + i + ': current');
      } else {
        dot.classList.add('step-dot--upcoming');
        dot.setAttribute('aria-label', 'Step ' + i + ': upcoming');
      }

      // Label number inside dot
      const label = document.createElement('span');
      label.textContent = i < currentStep ? '✓' : i;
      dot.appendChild(label);

      container.appendChild(dot);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UI — HEALTH RING
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Animates the SVG score ring to reflect score/100.
   * Expects .score-ring-fill (SVG circle) and .score-ring-text in the DOM.
   * @param {number} score  0–100
   */
  function updateHealthRing(score) {
    const clamped = clamp(score, 0, 100);

    const ring = $('.score-ring-fill');
    if (ring) {
      const offset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * clamped) / 100;
      ring.style.transition = 'stroke-dashoffset 0.8s ease';
      ring.style.strokeDasharray = RING_CIRCUMFERENCE;
      ring.style.strokeDashoffset = offset;

      // Color the ring based on score bracket
      if (clamped >= 75) {
        ring.style.stroke = '#acd157'; // green-light (fCC)
      } else if (clamped >= 50) {
        ring.style.stroke = '#f1be32'; // yellow (fCC)
      } else {
        ring.style.stroke = '#ffadad'; // red-light (fCC)
      }
    }

    // Update the score number element inside the ring
    const scoreNum = $('#sidebar-score') || $('.score-ring-num');
    if (scoreNum) {
      scoreNum.textContent = Math.round(clamped);
    }

    // Also update any .health-score-value elements
    $$('.health-score-value').forEach((el) => {
      el.textContent = Math.round(clamped);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UI — TOAST
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Shows a slide-in toast notification.
   * @param {string} message
   * @param {'success'|'warning'|'danger'|'info'} [type='info']
   */
  function showToast(message, type) {
    type = type || 'info';

    const icons = {
      success: '✓',
      warning: '⚠',
      danger: '✕',
      info: 'ℹ',
    };

    const toast = document.createElement('div');
    toast.className = 'bizsim-toast bizsim-toast--' + type;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    toast.innerHTML =
      '<span class="bizsim-toast__icon">' + (icons[type] || icons.info) + '</span>' +
      '<span class="bizsim-toast__message">' + _escapeHtml(message) + '</span>' +
      '<button class="bizsim-toast__close" aria-label="Dismiss">&times;</button>';

    // Inject styles if not already present
    _ensureToastStyles();

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('bizsim-toast--visible');
      });
    });

    // Close button
    const closeBtn = toast.querySelector('.bizsim-toast__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        _dismissToast(toast);
      });
    }

    // Auto-dismiss after 4s
    const timer = setTimeout(function () {
      _dismissToast(toast);
    }, 4000);

    // Cancel auto-dismiss on hover
    toast.addEventListener('mouseenter', function () {
      clearTimeout(timer);
    });
    toast.addEventListener('mouseleave', function () {
      setTimeout(function () {
        _dismissToast(toast);
      }, 2000);
    });
  }

  function _dismissToast(toast) {
    toast.classList.remove('bizsim-toast--visible');
    toast.addEventListener('transitionend', function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, { once: true });
  }

  function _ensureToastStyles() {
    if (document.getElementById('bizsim-toast-styles')) return;
    const style = document.createElement('style');
    style.id = 'bizsim-toast-styles';
    style.textContent = [
      '.bizsim-toast {',
      '  position: fixed;',
      '  bottom: 24px;',
      '  right: 24px;',
      '  z-index: 9999;',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 10px;',
      '  padding: 12px 18px;',
      '  border-radius: 10px;',
      '  font-size: 0.9rem;',
      '  font-weight: 500;',
      '  box-shadow: 0 8px 30px rgba(0,0,0,0.15);',
      '  max-width: 360px;',
      '  transform: translateY(80px);',
      '  opacity: 0;',
      '  transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease;',
      '  cursor: default;',
      '}',
      '.bizsim-toast--visible {',
      '  transform: translateY(0);',
      '  opacity: 1;',
      '}',
      '.bizsim-toast--success { background: #1b1b32; color: #acd157; border-left: 4px solid #acd157; }',
      '.bizsim-toast--warning { background: #1b1b32; color: #f1be32; border-left: 4px solid #f1be32; }',
      '.bizsim-toast--danger  { background: #1b1b32; color: #ffadad; border-left: 4px solid #ffadad; }',
      '.bizsim-toast--info    { background: #1b1b32; color: #99c9ff; border-left: 4px solid #99c9ff; }',
      '.bizsim-toast__icon { font-size: 1rem; flex-shrink: 0; }',
      '.bizsim-toast__message { flex: 1; line-height: 1.4; }',
      '.bizsim-toast__close {',
      '  background: none;',
      '  border: none;',
      '  cursor: pointer;',
      '  font-size: 1.1rem;',
      '  opacity: 0.6;',
      '  padding: 0 0 0 6px;',
      '  flex-shrink: 0;',
      '  line-height: 1;',
      '}',
      '.bizsim-toast__close:hover { opacity: 1; }',
    ].join('\n');
    document.head.appendChild(style);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UI — FEEDBACK ALERT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Renders a feedback alert inside a container element.
   * @param {string} containerId  ID of the container element
   * @param {{ correct: boolean, points: number, title: string, explanation: string }} opts
   */
  function showFeedback(containerId, opts) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('[BizSim] showFeedback: container not found —', containerId);
      return;
    }

    const correct = !!opts.correct;
    const type = correct ? 'success' : 'danger';
    const icon = correct ? '✓' : '✕';
    const defaultTitle = correct ? 'Correct!' : 'Not quite.';
    const title = opts.title || defaultTitle;
    const points = opts.points != null ? opts.points : null;

    container.innerHTML =
      '<div class="feedback-alert feedback-alert--' + type + '" role="alert">' +
        '<div class="feedback-alert__header">' +
          '<span class="feedback-alert__icon">' + icon + '</span>' +
          '<strong class="feedback-alert__title">' + _escapeHtml(title) + '</strong>' +
          (points !== null
            ? '<span class="feedback-alert__points">+' + points + ' pts</span>'
            : '') +
        '</div>' +
        (opts.explanation
          ? '<p class="feedback-alert__explanation">' + _escapeHtml(opts.explanation) + '</p>'
          : '') +
      '</div>';

    _ensureFeedbackStyles();

    // Scroll into view smoothly
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function _ensureFeedbackStyles() {
    if (document.getElementById('bizsim-feedback-styles')) return;
    const style = document.createElement('style');
    style.id = 'bizsim-feedback-styles';
    style.textContent = [
      '.feedback-alert {',
      '  border-radius: 10px;',
      '  padding: 14px 18px;',
      '  margin-top: 16px;',
      '  animation: feedbackIn 0.3s ease;',
      '}',
      '@keyframes feedbackIn {',
      '  from { opacity: 0; transform: translateY(6px); }',
      '  to   { opacity: 1; transform: translateY(0); }',
      '}',
      '.feedback-alert--success { background: rgba(172, 209, 87, 0.1); border-left: 4px solid #acd157; color: #acd157; }',
      '.feedback-alert--danger  { background: rgba(255, 173, 173, 0.1); border-left: 4px solid #ffadad; color: #ffadad; }',
      '.feedback-alert__header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }',
      '.feedback-alert__icon { font-size: 1rem; font-weight: 700; flex-shrink: 0; }',
      '.feedback-alert__title { font-size: 0.95rem; font-weight: 700; flex: 1; }',
      '.feedback-alert__points {',
      '  font-size: 0.8rem;',
      '  font-weight: 700;',
      '  background: rgba(0,0,0,0.08);',
      '  padding: 2px 8px;',
      '  border-radius: 20px;',
      '  flex-shrink: 0;',
      '}',
      '.feedback-alert__explanation { font-size: 0.88rem; margin: 0; line-height: 1.5; opacity: 0.9; }',
    ].join('\n');
    document.head.appendChild(style);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UI — ANIMATE SCORE
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Counts up the number displayed inside an element to targetScore.
   * @param {string} elementId
   * @param {number} targetScore
   * @param {number} [duration=1200]  ms
   */
  function animateScore(elementId, targetScore, duration) {
    const el = document.getElementById(elementId);
    if (!el) return;

    duration = duration || 1200;
    const start = parseInt(el.textContent, 10) || 0;
    const end = Math.round(targetScore);
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(now) {
      const elapsed = now - startTime;
      const progress = clamp(elapsed / duration, 0, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = end;
      }
    }

    requestAnimationFrame(tick);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Formats a number as a compact currency string.
   * Examples: 280000000000 → "$280B", 42000000 → "$42M", 420000 → "$420K", 149 → "$149"
   * @param {number} n
   * @returns {string}
   */
  function formatCurrency(n) {
    if (typeof n !== 'number' || isNaN(n)) return '$0';
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    if (abs >= 1e12) return sign + '$' + _compactNum(abs / 1e12) + 'T';
    if (abs >= 1e9) return sign + '$' + _compactNum(abs / 1e9) + 'B';
    if (abs >= 1e6) return sign + '$' + _compactNum(abs / 1e6) + 'M';
    if (abs >= 1e3) return sign + '$' + _compactNum(abs / 1e3) + 'K';
    return sign + '$' + abs.toFixed(0);
  }

  function _compactNum(n) {
    // Show one decimal only if needed
    return n % 1 === 0 ? n.toFixed(0) : n.toFixed(1).replace(/\.0$/, '');
  }

  /**
   * Clamps val between min and max.
   * @param {number} val
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /**
   * Linear interpolation between a and b at position t (0–1).
   * @param {number} a
   * @param {number} b
   * @param {number} t
   * @returns {number}
   */
  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  /**
   * Escapes HTML special characters to prevent XSS.
   * @param {string} str
   * @returns {string}
   */
  function _escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UNIT ECONOMICS CALCULATOR (convenience method used by module 3)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Calculates LTV, LTV:CAC ratio, and CAC Payback months.
   * @param {{ arpu: number, grossMargin: number, churnRate: number, cac: number }} inputs
   * @returns {{ ltv: number, ltvcac: number, cacPaybackMonths: number, ltvcacStatus: string, paybackStatus: string }}
   */
  function calcUnitEconomics(inputs) {
    const { arpu, grossMargin, churnRate, cac } = inputs;
    const gm = grossMargin / 100;
    const churn = churnRate / 100;

    // LTV = (ARPU × Gross Margin) / Monthly Churn
    const ltv = churn > 0 ? (arpu * gm) / churn : 0;

    // LTV:CAC
    const ltvcac = cac > 0 ? ltv / cac : 0;

    // CAC Payback = CAC / (ARPU × Gross Margin)
    const monthlyGrossProfit = arpu * gm;
    const cacPaybackMonths = monthlyGrossProfit > 0 ? cac / monthlyGrossProfit : Infinity;

    // Status from thresholds
    const data = window.BizSimData;
    let ltvcacStatus = 'danger';
    let paybackStatus = 'danger';

    if (data && data.module3 && data.module3.unitEconomicsThresholds) {
      const thresholds = data.module3.unitEconomicsThresholds;

      for (const t of thresholds.ltvcac) {
        if (ltvcac >= t.min) { ltvcacStatus = t.status; break; }
      }

      for (const t of thresholds.cacPayback) {
        if (cacPaybackMonths <= t.max) { paybackStatus = t.status; break; }
      }
    }

    return {
      ltv: Math.round(ltv),
      ltvcac: Math.round(ltvcac * 10) / 10,
      cacPaybackMonths: isFinite(cacPaybackMonths) ? Math.round(cacPaybackMonths * 10) / 10 : null,
      ltvcacStatus,
      paybackStatus,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DRAG-AND-DROP AFFINITY MAPPING HELPER
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Initialises drag-and-drop for the affinity mapping activity.
   * Expects cards with [data-card-id] and drop zones with [data-bucket-id].
   * Calls onChange(cardId, bucketId) whenever a card is dropped.
   *
   * @param {Function} onChange  (cardId: string, bucketId: string) => void
   */
  function initAffinityDnd(onChange) {
    const cards = $$('[data-card-id]');
    const zones = $$('[data-bucket-id]');

    cards.forEach(function (card) {
      card.setAttribute('draggable', 'true');

      card.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', card.dataset.cardId);
        card.classList.add('is-dragging');
      });

      card.addEventListener('dragend', function () {
        card.classList.remove('is-dragging');
      });
    });

    zones.forEach(function (zone) {
      zone.addEventListener('dragover', function (e) {
        e.preventDefault();
        zone.classList.add('is-over');
      });

      zone.addEventListener('dragleave', function () {
        zone.classList.remove('is-over');
      });

      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        zone.classList.remove('is-over');
        const cardId = e.dataTransfer.getData('text/plain');
        if (!cardId) return;

        const card = $('[data-card-id="' + cardId + '"]');
        if (card) {
          zone.appendChild(card);
          if (typeof onChange === 'function') {
            onChange(cardId, zone.dataset.bucketId);
          }
        }
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AUTO-INIT ON DOM READY
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Runs lightweight auto-setup on DOMContentLoaded:
   * - initSidebar() if sidebar elements are present
   * - Sets scenario color CSS variable
   * - Attaches reset buttons
   */
  function _autoInit() {
    // Sidebar (present on all module pages)
    if ($('.sidebar-nav-item') || $('.sidebar-scenario-pill') || $('.score-ring-fill')) {
      initSidebar();
    }

    // Scenario color variable
    const scenario = getScenario();
    if (scenario) {
      document.documentElement.style.setProperty('--scenario-color', scenario.color);
      document.documentElement.style.setProperty('--scenario-color-light', scenario.color + '22');
    }

    // Reset / restart buttons
    $$('[data-action="reset"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Reset all progress and start over?')) reset();
      });
    });

    // Module navigation buttons with data-navigate
    $$('[data-navigate]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        navigate(btn.getAttribute('data-navigate'));
      });
    });

    // Next-module buttons with data-next-module
    $$('[data-next-module]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const current = parseInt(btn.getAttribute('data-next-module'), 10);
        goToNextModule(current);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _autoInit);
  } else {
    _autoInit();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────────

  window.BizSim = {
    // State
    getState,
    setState,
    reset,

    // Scenario
    getScenario,
    setScenario,

    // Modules
    getModuleState,
    completeModule,
    canAccessModule,

    // Scoring
    getTotalScore,
    getViabilityRating,
    calcUnitEconomics,

    // Navigation
    navigate,
    goToNextModule,

    // UI
    initSidebar,
    initStepIndicator,
    updateHealthRing,
    showToast,
    showFeedback,
    animateScore,
    initAffinityDnd,

    // Helpers
    formatCurrency,
    clamp,
    lerp,
  };
})();
