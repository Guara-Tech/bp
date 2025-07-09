const logger = require('../utils/logger');
const actions = require('../utils/actions');

/**
 * MercadoLivre website handler
 */
class MercadoLivreHandler {
    /**
     * Create a new MercadoLivre handler
     * @param {object} page - The Playwright page object
     */
    constructor(page) {
        this.page = page;
        this.domain = 'www.mercadolivre.com.br';
        logger.info('MercadoLivre handler created');
    }

    /**
     * Buy an item on MercadoLivre
     * @param {string} item - The item to buy
     */
    async buyItem(item) {
        logger.info(`Attempting to buy item: ${item} on MercadoLivre`);

        try {
            await actions.try(async () => await this.page.getByText('Comprar agora', { timeout: 5000 }).click(), 'Clicar em comprar agora');

            logger.info('Waiting for UI to update, just if there is a popup');
            await this.page.waitForTimeout(5000);

            await actions.try(async () => await this.page.getByText('Continuar', { timeout: 5000 }).click(), 'Clicar no botão Continuar');

            await this.page.waitForTimeout(5000);
            await actions.try(async () => await this.page.getByText('Continuar', { timeout: 5000 }).click(), 'Clinar no segundo botão Continuar');

            await this.page.waitForTimeout(5000);
            await actions.scrollToBottom(this.page, 'Scroll to bottom before selecting payment method');

            await actions.try(async () => await this.page.getByText(process.env.MERCADOLIVRE_CC_ENDING_NUMBER, { timeout: 5000 }).click(), 'Escolher o cartão de crédito');

            await this.page.waitForTimeout(5000);
            await actions.try(async () => await this.page.getByRole('button').click(), 'Clicar no botão Continuar após escolher o cartão de crédito');
            await this.page.waitForTimeout(5000);
            
            await actions.try(async () => await this.page.getByRole('listitem').filter({ hasText: '1x' }).first().click(), 'Selecionar 1x de parcelamento');
            
            await this.page.waitForTimeout(5000);
            await actions.try(async () => await this.page.getByTestId('continue_button', { timeout: 5000 }).click(), 'Clicar no botão Continuar');
            
            await this.page.waitForTimeout(2000);
            await actions.try(async () => {
                const securityCodeFrame = this.page.locator('iframe[name="securityCode"]');
                const innerFrame = await securityCodeFrame.contentFrame();
                await innerFrame.locator('#securityCode').fill(process.env.MERCADOLIVRE_CVV);
            }, 'Preencher código de segurança (CVV)');

            await this.page.waitForTimeout(5000);
            await actions.try(async () => await this.page.locator('button[type=submit]', { timeout: 5000 }).click(), 'Clicar no último botão Continuar');
            
            await this.page.waitForTimeout(5000);
            await actions.try(async () => await this.page.getByTestId('review_price_box_confirm_button', { timeout: 5000, exact: true }).click(), 'Clicar no botão Confirmar a compra');

            logger.info(`Successfully initiated purchase for: ${item}`);
            return true;

        } catch (error) {
            logger.error(`Error buying item: ${error.message}`);
            return false;
        }
    }
}

module.exports = MercadoLivreHandler;
