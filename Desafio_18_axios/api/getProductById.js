const productRepository = require('../daos/productos/ProductosDaoMongoDB')

const getProductById = async (req, res) => {

    try {
        const id = req.params.id
        const productDetails = await productRepository.getProductById(id)
        console.log('Products de productDetails: ', productDetails)
        res.status(200).json({
            status: true,
            data: productDetails,
        })
        return productDetails
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err
        })
    }
}

module.exports = { getProductById }