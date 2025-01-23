const { getUserByToken } = require('../config/tokenStore'); 
const Response = require('../models/responseModel');       

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Token ')) {
        return res.status(200).send(Response.error('No autorizado'));
    }

    const token = authHeader.split(' ')[1];
    console.log(token);

    const dataToken = getUserByToken(token);

    if (!dataToken) {
        return res.status(200).send(Response.error('Token inválido o expirado'));
        
    }
    
    if (Date.now() > dataToken.exp) {
        return res.status(200).send(Response.error('Token expirado'));
    }

    req.user = dataToken.user;
    req.token = token;

    next();
};

module.exports = authMiddleware;
