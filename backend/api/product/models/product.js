'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        async afterCreate(result, data) {
            let { name, id } = result;
            const identifier = name.toLowerCase().replace(/\s/g, "-").replace(/[^a-zA-Z0-9-_]/g, '') + '-' + id;
            await strapi.query('product').update(
                { id },
                { identifier }
            );
        },
        async beforeUpdate(params, data) {
            const { name } = data;
            const { id } = params;
            if (name) {
                const _identifier = name.toLowerCase().replace(/\s/g, "-").replace(/[^a-zA-Z0-9-_]/g, '') + '-' + id;
                data.identifier = _identifier;
            }
        }
    }
};
