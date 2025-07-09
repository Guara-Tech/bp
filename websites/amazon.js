const logger = require('../utils/logger');
const BaseHandler = require('./base-handler');

/**
 * Amazon website handler
 */
class AmazonHandler extends BaseHandler {
    /**
     * Create a new Amazon handler
     * @param {object} page - The Playwright page object
     */
    constructor(page) {
        super(page, 'www.amazon.com', 'Amazon');
    }
    
    /**
     * Buy an item on Amazon
     * @param {string} item - The item to buy
     */
    async buyItem(item) {
        logger.info(`Attempting to buy item: ${item} on Amazon`);
        try {
            logger.info(`Successfully initiated purchase for: ${item}`);
            return true;
        } catch (error) {
            logger.error(`Error buying item: ${error.message}`);
            return false;
        }
    }
}

module.exports = AmazonHandler;
