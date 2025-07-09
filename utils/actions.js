const logger = require('./logger');

module.exports = {
    /**
     * Try an action and catch any errors
     * @param {Function} action - The action to try
     * @param {string} actionName - Name of the action for error logging
     * @returns {Promise<boolean>} - Whether the action succeeded
     */
    try: async (action, actionName) => {
        try {
            logger.info(`Attempting '${actionName}'`);
            await action();
            return true;
        } catch (error) {
            logger.error(`Error '${actionName}': ${error.message}`);
            return false;
        }
    },
    
    /**
     * Scroll to the bottom of the page
     * @param {Page} page - The Playwright page object
     * @param {Object} options - Options for scrolling
     * @returns {Promise<boolean>} - Whether the scroll succeeded
     */
    scrollToBottom: async (page, options = {}) => {
        const { 
            smooth = true, 
            stepSize = 250, 
            delay = 100,
            timeout = 10000
        } = options;
        
        try {
            logger.info('Scrolling to bottom of page');
            
            if (smooth) {
                // Get page height
                const pageHeight = await page.evaluate(() => document.body.scrollHeight);
                
                // Scroll in steps
                let currentPosition = 0;
                const startTime = Date.now();
                
                while (currentPosition < pageHeight) {
                    if (Date.now() - startTime > timeout) {
                        logger.warn('Scroll timeout reached');
                        break;
                    }
                    
                    currentPosition += stepSize;
                    await page.evaluate((position) => {
                        window.scrollTo({
                            top: position,
                            behavior: 'smooth'
                        });
                    }, currentPosition);
                    
                    // Wait a bit between scrolls
                    await page.waitForTimeout(delay);
                }
            } else {
                // Instant scroll to bottom
                await page.evaluate(() => {
                    window.scrollTo(0, document.body.scrollHeight);
                });
            }
            
            logger.info('Successfully scrolled to bottom');
            return true;
        } catch (error) {
            logger.error(`Error scrolling to bottom: ${error.message}`);
            return false;
        }
    }
}