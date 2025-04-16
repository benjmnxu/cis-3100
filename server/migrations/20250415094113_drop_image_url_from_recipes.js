exports.up = function (knex) {
    return knex.schema.alterTable('recipes', (table) => {
      table.dropColumn('image_url');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('recipes', (table) => {
      table.text('image_url');
    });
  };
  