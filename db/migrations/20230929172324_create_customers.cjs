/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
  return knex.schema.createTable('customers', t => {
    t.increments('Index');
    t.string('Customer Id').unique().index();
    t.string('First Name');
    t.string('Last Name');
    t.string('Company');
    t.string('City');
    t.string('Phone 1');
    t.string('Phone 2');
    t.string('Email');
    t.datetime('Subscription Date');
    t.text('Website');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
