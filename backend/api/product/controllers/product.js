'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
    async findOne(ctx) {
        const { id } = ctx.params;

        const entity = await strapi.services.product.findOne({ id });
        return sanitizeEntity(entity, { model: strapi.models.product });
    },
    async find(ctx) {
        let entities;
        if (ctx.query._q) {
            entities = await strapi.services.product.search(ctx.query);
            entities = entities.map(entity => {
                const { details, ..._entity } = entity;
                return _entity;
            });
        } else {
            entities = await strapi.services.product.find(ctx.query, [
                'id',
                'name',
                'description',
                'price',
                'image',
                'availible'
            ]);
        }

        return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.product }));
    },
};
