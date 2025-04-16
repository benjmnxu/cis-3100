exports.up = function (knex) {
    return knex.schema.createTable('recipes', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE');
      table.string('title', 255).notNullable();
      table.text('description');
      table.specificType('ingredients', 'TEXT[]');
      table.text('instructions');
      table.integer('prep_time');
      table.integer('cook_time');
      table.string('cuisine_type', 100);
      table.string('difficulty_level', 50);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('recipes');
  };
  