/**
 * BizSimModules — Shared utilities for Module 3 & Module 4.
 * Exposes window.BizSimModules.
 *
 * Depends on: window.BizSimData (data.js must be loaded first)
 */
(function () {
  'use strict';

  /**
   * Calculates unit economics metrics from raw inputs.
   * @param {number} arpu           Monthly revenue per customer ($)
   * @param {number} grossMarginPct Gross margin as a percentage (e.g. 72 for 72%)
   * @param {number} churnRatePct   Monthly churn rate as a percentage (e.g. 3.2 for 3.2%)
   * @param {number} cac            Customer Acquisition Cost ($)
   * @returns {{
   *   ltv: number,
   *   ltvCacRatio: number,
   *   cacPaybackMonths: number,
   *   ltvStatus: string,
   *   ratioStatus: string,
   *   paybackStatus: string,
   *   score: number
   * }}
   */
  function calcUnitEconomics(arpu, grossMarginPct, churnRatePct, cac) {
    var gm     = grossMarginPct / 100;
    var churn  = churnRatePct   / 100;

    // LTV = (ARPU × Gross Margin %) / Monthly Churn %
    var ltv             = churn > 0 ? (arpu * gm) / churn : 0;
    var ltvCacRatio     = cac   > 0 ? ltv / cac           : 0;
    var monthlyGP       = arpu * gm;
    var cacPaybackMonths = monthlyGP > 0 ? cac / monthlyGP : Infinity;

    // Status thresholds
    var ltvStatus     = ltvCacRatio     >= 3  ? 'success' : ltvCacRatio >= 2     ? 'warning' : 'danger';
    var ratioStatus   = ltvCacRatio     >= 3  ? 'success' : ltvCacRatio >= 2     ? 'warning' : 'danger';
    var paybackStatus = cacPaybackMonths <= 12 ? 'success' : cacPaybackMonths <= 18 ? 'warning' : 'danger';

    // Score
    var score = ltvCacRatio >= 3 ? 10 : ltvCacRatio >= 2 ? 7 : ltvCacRatio >= 1 ? 4 : 0;

    return {
      ltv:              Math.round(ltv),
      ltvCacRatio:      Math.round(ltvCacRatio     * 10) / 10,
      cacPaybackMonths: isFinite(cacPaybackMonths)
                          ? Math.round(cacPaybackMonths * 10) / 10
                          : null,
      ltvStatus:    ltvStatus,
      ratioStatus:  ratioStatus,
      paybackStatus: paybackStatus,
      score:        score,
    };
  }

  /**
   * Builds a Geoffrey Moore positioning statement from field values.
   * @param {{ customer: string, problem: string, category: string, benefit: string, alternative: string, differentiator: string }} fields
   * @returns {string}
   */
  function buildPositioningStatement(fields) {
    var customer      = fields.customer      || '[target customer]';
    var problem       = fields.problem       || '[has this problem]';
    var category      = fields.category      || '[category]';
    var benefit       = fields.benefit       || '[key benefit]';
    var alternative   = fields.alternative   || '[alternatives]';
    var differentiator = fields.differentiator || '[key differentiator]';

    return (
      'For ' + customer +
      ' who ' + problem +
      ' — [Product] is a ' + category +
      ' that ' + benefit + '. ' +
      'Unlike ' + alternative + ', ' +
      'we ' + differentiator + '.'
    );
  }

  /**
   * Scores a lean canvas based on how many of the 9 blocks contain meaningful text.
   * Meaningful = at least 5 words.
   * @param {Object.<string, string>} values  Map of block ID → text value
   * @returns {number}  0–10
   */
  function scoreCanvas(values) {
    var filled = Object.values(values).filter(function (v) {
      return v && v.trim().split(/\s+/).length >= 5;
    }).length;
    return Math.round((filled / 9) * 10);
  }

  /**
   * Scores channel selection against the correct channels.
   * @param {string[]} selected  Array of selected channel IDs (should be exactly 2)
   * @param {string[]} correct   Array of correct channel IDs
   * @returns {number}  10 | 5 | 2 | 0
   */
  function scoreChannelSelection(selected, correct) {
    if (!selected || selected.length === 0) return 0;
    var matches = selected.filter(function (s) {
      return correct.indexOf(s) !== -1;
    }).length;
    if (matches === 2) return 10;
    if (matches === 1) return 5;
    return selected.length > 0 ? 2 : 0;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  window.BizSimModules = {
    calcUnitEconomics:         calcUnitEconomics,
    buildPositioningStatement: buildPositioningStatement,
    scoreCanvas:               scoreCanvas,
    scoreChannelSelection:     scoreChannelSelection,
  };
})();
