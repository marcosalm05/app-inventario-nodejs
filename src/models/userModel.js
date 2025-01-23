const pool = require('../config/db');

class User {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    // Buscar usuario por nombre de usuario
    static async findByUsername(username) {
        try {
            const result = await pool.query('SELECT us_nro, trim(us_login) us_login, trim(us_sena)us_sena FROM usuario WHERE upper(TRIM(us_login)) = $1', [username]);
            if (result.rows.length) {
                console.log(result.rows[0])
                const { us_nro, us_login, us_sena } = result.rows[0];
                return new User(us_nro, us_login, us_sena);
            }
            return null; // Si no se encuentra el usuario
        } catch (err) {
            console.error('Error finding user by username:', err.stack);
            throw err;
        }
    }

    // Validar la contraseña del usuario
    validatePassword(password) {
        return this.password === password;
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
        };
    }
}

module.exports = User;
