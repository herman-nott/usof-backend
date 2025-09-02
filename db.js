const knex = require('knex');

const database = knex({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'ger06man',
        database: 'usof_db',
    },
});

module.exports = database;