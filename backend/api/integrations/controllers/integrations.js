'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
    async find() {
        let entity = await strapi.services.integrations.find();

        if (entity.ReCaptcha && entity.ReCaptcha.secret) {
            delete entity.ReCaptcha.secret;
        }

        if (entity.Notification) {
            delete entity.Notification;
        }

        return sanitizeEntity(entity, { model: strapi.models.integrations });
    },
};
