
exports.up = function(knex, Promise) {
    return knex.schema.createTable('friends', function(table) {
        table.increments();
        table.integer('user_id1').notNullable();
        table.integer('user_id2').notNullable();
        table.string('status').notNullable();
        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('friends');
};
