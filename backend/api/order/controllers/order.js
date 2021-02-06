'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const fetch = require('node-fetch');
const querystring = require('querystring');

const validateCaptcha = async (token, secret) => {
    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify?' + querystring.stringify({
            secret: secret,
            response: token
        }), {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
        if (!response || response.status !== 200) {
            return false;
        }
        const parsedResponse = await response.json();

        if (parsedResponse && parsedResponse.success) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
};

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
        return sanitizeEntity(entity, { model: strapi.models.order });
    },
};
