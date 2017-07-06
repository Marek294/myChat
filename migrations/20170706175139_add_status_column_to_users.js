
exports.up = function(knex, Promise) {
    return knex.schema.table('users', function(table) {
        table.boolean('is_online').notNull().defaultTo(0);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function(table) {
        table.dropColumn('is_online');
    });
};
