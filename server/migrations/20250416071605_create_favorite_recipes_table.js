exports.up = function(knex) {
    return knex.schema.createTable('favorite_recipes', (table) => {
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.integer('recipe_id').references('id').inTable('recipes').onDelete('CASCADE');
      table.date('saved_date').defaultTo(knex.fn.now());
      table.primary(['user_id', 'recipe_id']); // Composite PK to avoid duplicates
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('favorite_recipes');
  };
  