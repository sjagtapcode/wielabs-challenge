/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('organizations', t => {
    t.increments('Index');
    t.string('Organization Id').unique().index();
    t.string('Name');
    t.text('Website');
    t.string('Country');
    t.text('Description');
    t.integer('Founded').unsigned();
    t.string('Industry');
    t.integer('Number of employees').unsigned();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
