const { getUserByToken } = require('../config/tokenStore'); // Ajusta la ruta
const Response = require('../models/responseModel');              // Ajusta la ruta

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Token ')) {
        return res.status(200).send(Response.error('No autorizado'));
    }

    const token = authHeader.split(' ')[1];
    const user = getUserByToken(token);

    if (!user) {
        return res.status(200).send(Response.error('Token inválido o expirado'));
    }

    req.user = user;
    next();
};

module.exports = authMiddleware;
