exports.up = function (knex) {
    return knex.schema.alterTable('images', (table) => {
      table.dropForeign('recipe_id');
      table.foreign('recipe_id').references('recipes.id').onDelete('CASCADE');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('images', (table) => {
      table.dropForeign('recipe_id');
      table.foreign('recipe_id').references('recipes.id');
    });
  };
  