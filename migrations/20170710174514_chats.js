
exports.up = function(knex, Promise) {
    return knex.schema.createTable('chats', function(table) {
        table.increments();
        table.string('name').notNullable();
        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('chats');
};
