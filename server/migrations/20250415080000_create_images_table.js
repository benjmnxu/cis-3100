exports.up = function(knex) {
    return knex.schema.createTable('images', (table) => {
      table.increments('id').primary();
      table.integer('recipe_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('recipes')
        .onDelete('CASCADE');
      table.text('url').notNullable(); // image URL
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.integer('user_id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('images');
  };
  