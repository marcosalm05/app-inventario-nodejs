const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModel');
const Response = require('../models/responseModel');
const authMiddleware = require('../config/authMiddleware');
const tokenStore = require('../config/tokenStore');

// Función para desordenar la palabra "4303489"
function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

// Ruta de login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar usuario por nombre
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(200).send(Response.error("Usuario no encontrado"));
        }

        // Validar contraseña
        if (!user.validatePassword(password)) {
            return res.status(200).send(Response.error('Credenciales invalidas'));
        }

        // Generar token
        const uuid = uuidv4();
        const shuffledWord = shuffleWord('4303489');
        const token = `${uuid}-cur${shuffledWord}`;

        // Guardar token en el tokenStore
        tokenStore.addToken(token, user);
        // Guardar token en la sesión
        req.session.token = token;
        // Retornar token al cliente
        const data = {
            token: token,
            user: user,
        };
        //res.json(Response.ok(data));
        res.redirect('/products/search');
    } catch (err) {
        console.error('Error during login:', err.stack);
        res.status(500).send('An error occurred during login');
    }
});

// Ruta para renderizar la vista de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta protegida
router.get('/token', authMiddleware, (req, res) => {
    const data = {
        user: req.user,
        message: 'Token válido',
    };
    res.send(Response.ok(data));
});

module.exports = router;
