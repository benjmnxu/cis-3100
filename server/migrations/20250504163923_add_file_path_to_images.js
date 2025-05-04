exports.up = function(knex) {
    return knex.schema.alterTable('images', (table) => {
      table.text('file_path'); // or .string() if short URLs
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('images', (table) => {
      table.dropColumn('file_path');
    });
  };
  