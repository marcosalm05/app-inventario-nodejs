const { Pool } = require('pg');
const dbConfig = require('../../config/dbConfig');

// Crear una nueva instancia de Pool
const pool = new Pool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
});

// Probar la conexión
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Connected to the PostgreSQL database');
    }
});

module.exports = pool;
