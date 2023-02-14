const productRepository = require('../contenedores/containerMongoDB')

const createProduct = async (req, res) => {
    try {
        const payload = {
            timestamp: new Date().toLocaleString('en-GB'),
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            picture: req.body.picture,
            code: req.body.code,
            stock: req.body.stock,
            category: req.body.category
        }
        const product = await productRepository.createProduct({
            ...payload
        })
        res.status(200).json({
            status: true,
            data: product,
        })
        return product
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err,
            status: false,
        })
    }
}

module.exports = { createProduct }