
exports.up = function(knex, Promise) {
    return knex.schema.createTable('members', function(table) {
        table.increments();
        table.integer('chat_id').notNullable();
        table.integer('user_id').notNullable();
        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('members');
};
