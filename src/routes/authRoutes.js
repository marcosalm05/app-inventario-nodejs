const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModel');
const Response = require('../models/responseModel');
const authMiddleware = require('../config/authMiddleware');
const tokenStore = require('../config/tokenStore');
const { use } = require('passport');

function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if(username === undefined || password === undefined) {
        return res.status(200).send(Response.error("Los campos 'username' y 'password' son requeridos"));
    }

    try {
        // Buscar usuario por nombre
        const userTemp = await User.findByUsername(username);

        if (!userTemp) {
            return res.status(200).send(Response.error("Usuario no encontrado"));
        }

        // Validar contraseña
        if (!userTemp.validatePassword(password)) {
            return res.status(200).send(Response.error('Credenciales invalidas'));
        }

        // Generar token
        const uuid = uuidv4();
        const shuffledWord = shuffleWord('4303489');
        const token = `${uuid}-cur${shuffledWord}`;
        const exp = Date.now() + 1000 * 60 * 60 * 12;
        const user = userTemp.toJSON();

        const dataToken = {
            exp: exp,
            user: user,
        }

        tokenStore.addToken(token, dataToken);

        const data = {
            token: token,
            exp: exp,
            user: user,
        };
        res.json(Response.ok(data));
    } catch (err) {
        console.error('Error during login:', err.stack);
        res.status(500).send('An error occurred during login');
    }
});

router.post('/api/logout', authMiddleware, (req, res) => {
    try {
        tokenStore.removeToken(req.token);

        // Retornar token al cliente
        const data = {
            message: 'Sesión cerrada',
        };
        res.json(Response.ok(data));
    } catch (err) {
        console.error('Error during login:', err.stack);
        res.status(500).send('An error occurred during logout');
    }
});

router.get('/api/token', authMiddleware, (req, res) => {
    const data = {
        user: req.user,
        message: 'Token válido',
    };
    res.send(Response.ok(data));
});

module.exports = router;
