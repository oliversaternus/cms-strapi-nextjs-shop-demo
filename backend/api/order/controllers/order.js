'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

const validateCaptcha = async (token) => {
    return true;
};

module.exports = {
    async create(ctx) {
        const integrations = await strapi.services.integrations.find();
        if (integrations.ReCaptcha && integrations.ReCaptcha.enabled) {
            const captchaToken = ctx.query.captchaToken;
            const validated = await validateCaptcha(captchaToken);
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
        return sanitizeEntity(entity, { model: strapi.models.order });
    },
};
