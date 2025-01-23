require('dotenv').config();

const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const coreRoutes = require('./routes/coreRoutes');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use(coreRoutes);

// Página de inicio
app.get('/', (req, res) => {
    res.redirect('login');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});