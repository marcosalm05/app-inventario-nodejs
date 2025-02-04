// Used to configure the database connection
const fs = require('fs');
const path = require('path');

const poolConfigPath = path.join(__dirname, '../pool.json');
const poolConfig = JSON.parse(fs.readFileSync(poolConfigPath, 'utf8'));





const defaultDb = poolConfig[0];

module.exports = {
    host: defaultDb.host,
    user:  'postgres',
    password: 'SCT-2014',
    database: defaultDb.base,
    port: defaultDb.puerto,
};