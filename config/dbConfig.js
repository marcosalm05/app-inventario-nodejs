module.exports = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'SCT-2014',
    database: process.env.DB_NAME || 'superavenida',
    port: process.env.DB_PORT || 5432,
};