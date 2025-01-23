const tokenStore = new Map();

// Funciones para manipular los tokens
function addToken(token, data) {
    tokenStore.set(token, data);
}

function getUserByToken(token) {
    return tokenStore.get(token);
}

function isValidToken(token) {
    return tokenStore.has(token);
}

function removeToken(token) {
    tokenStore.delete(token);
}

module.exports = {
    addToken,
    getUserByToken,
    isValidToken,
    removeToken
};
