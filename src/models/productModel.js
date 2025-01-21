class Product {
    constructor(id, code, name, description, price) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.price = price;
    }

    static async findByCode(code) {
        const query = 'SELECT * FROM products WHERE code = $1';
        const values = [code];
        const result = await db.query(query, values);
        if (result.rows.length > 0) {
            return new Product(result.rows[0].id, result.rows[0].code, result.rows[0].name, result.rows[0].description, result.rows[0].price);
        }
        return null;
    }
}

module.exports = Product;