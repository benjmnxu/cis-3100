exports.up = function(knex) {
    return knex.schema.createTable('reviews', (table) => {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.integer('recipe_id').references('id').inTable('recipes').onDelete('CASCADE');
      table.integer('rating').notNullable();
      table.text('comment');
      table.timestamp('created_at').defaultTo(knex.fn.now());
  
      table.unique(['user_id', 'recipe_id']); // One review per user per recipe
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('reviews');
  };
  