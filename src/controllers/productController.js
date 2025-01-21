class ProductController {
    constructor(productModel) {
        this.productModel = productModel;
    }

    async searchProduct(req, res) {
        const productCode = req.query.code;

        if (!productCode) {
            return res.status(400).json({ message: "Código de producto es requerido." });
        }

        try {
            const product = await this.productModel.findByCode(productCode);
            if (!product) {
                return res.status(404).json({ message: "Producto no encontrado." });
            }
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ message: "Error al buscar el producto.", error });
        }
    }
}

module.exports = ProductController;