exports.up = function(knex) {
    return knex.schema.alterTable('images', (table) => {
      table.dropColumn('url');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('images', (table) => {
      table.dropColumn('file_path');
      table.text('url').notNullable();
    });
  };
  