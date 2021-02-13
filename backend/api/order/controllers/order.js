'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const validateCaptcha = require('../../../utils/validateCaptcha');

module.exports = {
    async create(ctx) {
        const integrations = await strapi.services.integrations.find();
        if (integrations.ReCaptcha && integrations.ReCaptcha.enabled) {
            const captchaToken = ctx.query.captchaToken;
            const validated = await validateCaptcha(captchaToken, integrations.ReCaptcha.secret);
            if (!validated) {
                return ctx.badRequest(
                    null,
                    'invalid captcha'
                );
            }
        }

        let entity;
        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.order.create(data, { files });
        } else {
            entity = await strapi.services.order.create(ctx.request.body);
        }
        if (
            integrations.Notification &&
            integrations.Notification.OrderReceived &&
            integrations.Notification.NotifiedEmail
        ) {
            strapi.plugins['email'].services.email.send({
                to: integrations.Notification.NotifiedEmail,
                subject: `New Order from ${entity.firstName} ${entity.lastName}`,
                html: `
              You received a new order from ${entity.firstName} ${entity.lastName}!<br/>
              <br/>
              Email:<br/>
              ${entity.email}<br/>
              <br/>
              Total Price:<br/>
              ${entity.totalPrice}<br/>
              <br/>
              Shipping Country:<br/>
              ${entity.shippingCountry}<br/>
              <br/>
              Details:<br/>
              ${entity.items && entity.items.map(item =>
                    `----------------------------<br/>
                    Product: ${item.product.name}<br/>
                    <br/>
                    ProductId: ${item.product.id}<br/>
                    <br/>
                    ProductPrice: ${item.product.price}<br/>
                    <br/>
                    Quantity: ${item.quantity}<br/>
                    ----------------------------<br/>
                    `
                ).join('')}
            `
            });
        }
        delete entity.items;
        return sanitizeEntity(entity, { model: strapi.models.order });
    },
};
