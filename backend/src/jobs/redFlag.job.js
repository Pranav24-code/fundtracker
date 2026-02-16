const cron = require('node-cron');
const Project = require('../models/Project');
const { calculateRiskFlag } = require('../utils/redFlag.utils');
const { sendAlertEmail } = require('../utils/email.utils');

/**
 * Automated Red Flag Detection Job
 * Runs every 6 hours to scan all active projects
 */
const redFlagScanJob = cron.schedule(
  process.env.RED_FLAG_SCAN_CRON || '0 */6 * * *',
  async () => {
    console.log('🚨 Running automated red flag detection...');

    try {
      const projects = await Project.find({
        isActive: true,
        status: { $ne: 'Completed' },
      }).populate('contractor', 'name email');

      let flaggedCount = 0;
      let newFlagsCount = 0;

      for (const project of projects) {
        const previousFlag = project.riskFlag;

        // Calculate risk
        const riskData = calculateRiskFlag(project);

        // Update project
        project.riskFlag = riskData.isRisky;
        project.riskFactors = riskData.factors;

        // Update status based on risk
        if (riskData.riskLevel >= 3) {
          project.status = 'Critical';
        } else if (riskData.riskLevel > 0 && project.status === 'On Time') {
          project.status = 'Delayed';
        }

        await project.save();

        if (riskData.isRisky) {
          flaggedCount++;

          // Send alert if newly flagged
          if (!previousFlag && riskData.isRisky) {
            newFlagsCount++;

            // Send email to admin
            await sendAlertEmail({
              to: process.env.ADMIN_EMAIL || 'admin@petms.gov.in',
              subject: `⚠️ Red Flag Alert: ${project.title}`,
              project,
              riskFactors: riskData.factors,
            });
          }
        }
      }

      console.log(
        `✅ Red flag scan complete: ${flaggedCount} flagged projects (${newFlagsCount} new)`
      );
    } catch (error) {
      console.error('❌ Red flag scan error:', error);
    }
  },
  {
    scheduled: false,
  }
);

// Start the job
exports.startRedFlagJob = () => {
  redFlagScanJob.start();
  console.log('✅ Red flag detection job started');
};

// Stop the job
exports.stopRedFlagJob = () => {
  redFlagScanJob.stop();
  console.log('⛔ Red flag detection job stopped');
};
