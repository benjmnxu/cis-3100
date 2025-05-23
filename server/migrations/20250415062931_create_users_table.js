exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').notNullable().unique();
      table.string('password_hash').notNullable();
      table.timestamps(true, true); // created_at, updated_at
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users');
  };
  