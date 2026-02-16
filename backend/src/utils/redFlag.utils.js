const { RED_FLAG_THRESHOLDS } = require('../config/constants');

/**
 * Calculate risk flag based on multiple factors
 * @param {Object} project - Project document
 * @returns {Object} { isRisky: boolean, riskLevel: number, factors: array }
 */
exports.calculateRiskFlag = (project) => {
  const riskFactors = [];

  // Factor 1: Budget Overrun
  // If spent >90% but completion <50%
  const spendingPercent = (project.amountSpent / project.totalBudget) * 100;
  if (
    spendingPercent > RED_FLAG_THRESHOLDS.BUDGET_OVERRUN_PERCENT &&
    project.completionPercentage < RED_FLAG_THRESHOLDS.COMPLETION_LAG_PERCENT
  ) {
    riskFactors.push('BUDGET_OVERRUN');
  }

  // Factor 2: Timeline Delay
  // If delayed by more than 30 days
  const delayDays = calculateDelayDays(project.expectedEndDate);
  if (delayDays > RED_FLAG_THRESHOLDS.DELAY_DAYS) {
    riskFactors.push('TIMELINE_DELAY');
  }

  // Factor 3: Sudden Budget Spike
  // If budget increased by >20% from original
  if (project.budgetHistory && project.budgetHistory.length > 0) {
    const originalBudget = project.budgetHistory[0].amount;
    if (originalBudget > 0) {
      const increasePercent =
        ((project.totalBudget - originalBudget) / originalBudget) * 100;
      if (increasePercent > RED_FLAG_THRESHOLDS.BUDGET_SPIKE_PERCENT) {
        riskFactors.push('BUDGET_SPIKE');
      }
    }
  }

  // Factor 4: GPS Verification Failed
  // This will be set by the update controller when GPS mismatch is detected

  // Factor 5: High Complaint Volume
  // This will be checked separately in complaint controller

  return {
    isRisky: riskFactors.length > 0,
    riskLevel: riskFactors.length,
    factors: riskFactors,
  };
};

/**
 * Calculate days of delay
 * @param {Date} expectedEndDate
 * @returns {number} Days delayed (0 if not delayed)
 */
const calculateDelayDays = (expectedEndDate) => {
  const today = new Date();
  const expectedEnd = new Date(expectedEndDate);

  if (today > expectedEnd) {
    const diffTime = Math.abs(today - expectedEnd);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return 0;
};

/**
 * Generate risk alert message
 * @param {Array} factors - Array of risk factor codes
 * @returns {string} Human-readable alert message
 */
exports.generateRiskMessage = (factors) => {
  const messages = {
    BUDGET_OVERRUN: 'Spent >90% of budget but only <50% complete',
    TIMELINE_DELAY: 'Project delayed by more than 30 days',
    BUDGET_SPIKE: 'Budget increased by more than 20%',
    GPS_FRAUD: 'GPS verification failed on recent update',
    PUBLIC_CONCERN: 'High number of citizen complaints',
  };

  return factors.map((factor) => messages[factor]).join('. ');
};

/**
 * Determine alert severity
 * @param {number} riskLevel - Number of risk factors (0-5)
 * @returns {string} 'low' | 'medium' | 'high' | 'critical'
 */
exports.getRiskSeverity = (riskLevel) => {
  if (riskLevel === 0) return 'low';
  if (riskLevel <= 2) return 'medium';
  if (riskLevel <= 3) return 'high';
  return 'critical';
};
