// migrations/XXXXXXXXXXXX_create_search_history_table.js

exports.up = function(knex) {
    return knex.schema.createTable('search_history', (table) => {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('query').notNullable();
      table.date('search_date').defaultTo(knex.fn.now());
      table.integer('results_count').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('search_history');
  };
  