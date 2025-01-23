const pool = require('../config/db');

class Product {
    constructor(id, code, description, stock, dep) {
        this.id = id;
        this.code = code;
        this.description = description;
        this.stock = stock;
        this.dep = dep;
    }

    static toJSON(product) {
        return {
            id: product.id,
            code: product.code,
            description: product.description,
            stock: product.stock,
            dep: product.dep,
        };
    }

    // Buscar producto por código
    static async findByCode(code, deposito) {
        const query = `
            SELECT 
                pro_codigo, 
                TRIM(pro_codori) AS pro_codori, 
                TRIM(pro_detalle) AS pro_detalle ,
                COALESCE( SUM(sto_cantidad),0) AS cantidad
            FROM productos LEFT JOIN depstock ON pro_codigo = sto_procodigo
            WHERE 
                pro_codori = $1
                AND sto_borrado = 0 AND sto_deposito = $2
            GROUP BY pro_codigo, pro_codori, pro_detalle LIMIT 1
        `;
        const values = [code, deposito];
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            const row = result.rows[0];
            const product = new Product(row.pro_codigo, row.pro_codori, row.pro_detalle, row.cantidad, deposito);

            return [product];
        }
        return null;
    }

    static async findById(id, deposito) {
        const query = `
            SELECT 
                pro_codigo, 
                TRIM(pro_codori) AS pro_codori, 
                TRIM(pro_detalle) AS pro_detalle ,
                COALESCE( SUM(sto_cantidad),0) AS cantidad
            FROM productos LEFT JOIN depstock ON pro_codigo = sto_procodigo
            WHERE 
                pro_codigo = $1
                AND sto_borrado = 0 AND sto_deposito = $2
            GROUP BY pro_codigo, pro_codori, pro_detalle LIMIT 1
        `;
        const values = [id, deposito];
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            const row = result.rows[0];
            const product = new Product(row.pro_codigo, row.pro_codori, row.pro_detalle, row.cantidad, deposito);

            return [product];
        }
        return null;
    }

    // Buscar productos por descripción o código (parcial)
    static async findByDescription(term, deposito) {
        const query = `
            SELECT 
                pro_codigo, 
                TRIM(pro_codori) AS pro_codori, 
                TRIM(pro_detalle) AS pro_detalle ,
                COALESCE( SUM(sto_cantidad),0) AS cantidad
            FROM productos LEFT JOIN depstock ON pro_codigo = sto_procodigo
            WHERE 
                pro_codori ILIKE $1 OR pro_detalle ILIKE $1
                AND sto_borrado = 0 AND sto_deposito = $2
            GROUP BY pro_codigo, pro_codori, pro_detalle 
        `;
        const values = [`%${term}%`, deposito];
        const result = await pool.query(query, values);
        return result.rows.map(row => new Product(row.pro_codigo, row.pro_codori, row.pro_detalle, row.cantidad, deposito));
    }

    static async restarStock(data, stock) {
        const query = `
          SELECT restar_cantidades(
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
          );
        `;

        try {
            await pool.query(query, [
                "INVENTARIO MÓVIL (-)",
                data.id,
                0,
                stock*-1,
                0,
                data.dep,
                "0",
                0,
                0,
                "UNITARIO",
                1,
                "AJUSTES",
                false,
            ]);
            return true;
        } catch (err) {
            console.error('Error al restar stock:', err.message);
            throw JSON.parse(err.message).mensaje;
        }
    }

    static async sumarStock(data, stock) {
        const query = `
          SELECT sumar_cantidades(
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
          );
        `;

        try {
            await pool.query(query, [
                "INVENTARIO MÓVIL (+)",
                data.id,
                0,
                stock,
                0,
                data.dep,
                "0",
                0,
                0,
                "",
                "MOVIL",
                "UNITARIO",
                1,
                "AJUSTES",
            ]);
            return true;
        } catch (err) {
            console.error('Error al restar stock:', err);
            throw err;
        }
    }


}

module.exports = Product;
