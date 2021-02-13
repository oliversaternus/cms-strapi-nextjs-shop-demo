'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
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
            entity = await strapi.services.message.create(data, { files });
        } else {
            entity = await strapi.services.message.create(ctx.request.body);
        }
        return sanitizeEntity(entity, { model: strapi.models.message });
    },
};