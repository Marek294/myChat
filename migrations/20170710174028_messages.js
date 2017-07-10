
exports.up = function(knex, Promise) {
    return knex.schema.createTable('messages', function(table) {
        table.increments();
        table.integer('chat_id').notNullable();
        table.integer('sender_id').notNullable();
        table.string('content').notNullable();
        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('messages');
};
