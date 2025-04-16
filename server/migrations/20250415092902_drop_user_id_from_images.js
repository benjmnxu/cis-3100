exports.up = function (knex) {
    return knex.schema.alterTable('images', (table) => {
      table.dropColumn('user_id');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('images', (table) => {
      table.integer('user_id').notNullable();
    });
  };
  