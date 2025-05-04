exports.up = function(knex) {
    return knex.schema.alterTable('images', (table) => {
      table.timestamp('uploaded_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('images', (table) => {
      table.dropColumn('uploaded_at');
    });
  };
  