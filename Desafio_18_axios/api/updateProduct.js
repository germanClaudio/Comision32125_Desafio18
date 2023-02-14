const productRepository = require('../contenedores/containerMongoDB')

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id
        const newValues = {
            timestamp: new Date().toLocaleString('en-GB'),
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            picture: req.body.picture,
            code: req.body.code,
            stock: req.body.stock,
            category: req.body.category
        }
        const productUpdated = await productRepository.updateProduct(id, newValues, { new: true })
        res.status(200).json({
            status: true,
            data: productUpdated,
        })
        return productUpdated
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err
        })
    }
}

module.exports = { updateProduct }