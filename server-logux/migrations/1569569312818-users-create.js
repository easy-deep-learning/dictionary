// https://github.com/balmasi/migrate-mongoose#readme

const { User } = require('../src/models')


/**
 * Make any changes you need to make to the database here
 */
async function up () {
  // Write migration here
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
