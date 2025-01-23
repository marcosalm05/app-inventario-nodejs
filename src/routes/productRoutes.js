const express = require('express');
const Product = require('../models/productModel');
const Response = require('../models/responseModel');
const router = express.Router();
const authMiddleware = require('../config/authMiddleware');


router.get('/api/search', async (req, res) => {
    try {
        const { cod, q, dep } = req.query;
        if (!cod && !q) {
            return res.json(Response.error('Ingresar cod o q como parámetros de consulta.'));
        }

        if (!dep) {
            return res.json(Response.error('Deposito es obligatorio'));
        }


        if (cod) {
            // Buscar por código
            const products = await Product.findByCode(cod, dep);
            if (products && products.length > 0) {
                return res.json(products);
            } else {
                return res.json([]);
            }
        } else if (q) {
            // Buscar por descripción o código parcial
            const products = await Product.findByDescription(q, dep);
            if (products.length > 0) {
                return res.json(products);
            } else {
                return res.json([]);
            }
        }

        res.json(Response.error('Error en la consulta'));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while searching for products.' });
    }
});

router.post('/api/inventory', authMiddleware, async (req, res) => {
    try {
        const { id, stock, dep } = req.body;
        console.log({ id, stock, dep });

        if (!id || !stock || !dep) {
            return res.json(Response.error('Los campos id, stock y dep son obligatorios.'));
        }

        if (typeof stock !== 'number' || stock === 0) {
            return res.json(Response.error("El campo 'stock' debe ser un número distinto de 0."));
        }

        const products = await Product.findById(id, dep);
        if (products.length == 0) {
            return res.json(Response.error('Producto no encontrado'));
        }

        const product = products[0];
        product.dep = dep;
        product.stock += stock;

        let data, message;

        if (stock < 0) {
            message = 'Stock disminuido correctamente';
            await Product.restarStock(Product.toJSON(product), stock);
        } else {
            message = 'Stock incrementado correctamente';
            await Product.sumarStock(Product.toJSON(product), stock);
        }



        data = {
            message,
            product: Product.toJSON(product),
        }

        return res.json(Response.ok(data));
    } catch (error) {
        console.error(error);
        return res.json(Response.error(error));
    }
});

module.exports = router;
