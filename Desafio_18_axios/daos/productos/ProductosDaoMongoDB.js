const ContenedorMongoDB = require('../../contenedores/productos/containerMongoDB.js')
// const { options } = require('../../options/config.js')
//const dbConnection = require('../../DB/configMongoDB.js')

const Productos = require('../../models/productos.models.js')
const logger = require('../../utils/winston.js')

const { ProductosDto } = require('../../dto/productosDto.js')
const { Cotizador } = require('../../utils/cotizador.js')
// const { asDto } = require('../../dto/productosDto.js')


const currency = process.env.CURRENCY

class ProductosDaoMongoDB extends ContenedorMongoDB {
    constructor(cnxStr) {
        super(cnxStr)   
        this.cotizador = new Cotizador()
    }

    async init() {
         await this.connection
    }
    
    async getAllProducts(){
        try {
            const products = await Productos.find()
            logger.info('Productos encontrados... ProductosDaoMongoDB---->')
            return products  //asDto(products)
        } catch (error) {
            logger.error("Error MongoDB getProducts: ",error)
        }
    }

    async getProductById(id) {
        if(id){
            try {
                const product = await Productos.findById(id)
                logger.info('Producto encontrado: ',product)
                return product
            } catch (error) {
                logger.error("Error MongoDB getOneProducts: ",error)
            }
        } else {
            try {
                const products = await Productos.find()
                return products
            } catch (error) {
                logger.error("Error MongoDB getOneProducts: ",error)
            }
        }
    }

    //-------------------------Dto------------------------------------
    async getCotizacionEnDolares(id) {
        
        if(id){
            try {
                const product = await Productos.findById(id)
                const cotizaciones = {
                    ProcioDolar: this.cotizador
                    .getPrecioSegunMoneda(product.price, currency),
                    moneda: currency
                }
                const productoDto = new ProductosDto(product, cotizaciones)
                return productoDto

            } catch (error) {
                logger.error("Error MongoDB getOneProducts: ",error)
            }
        } else {
            try {
                const products = await Productos.find()
                const productosDto = products.map(product => {
                    const cotizaciones = {
                        precioDolar: this.cotizador
                        .getPrecioSegunMoneda(product.price, currency),
                        moneda: currency
                    }
                    const productoDto = new ProductosDto(product, cotizaciones, currency)
                    return productoDto
                })
                return productosDto
            } catch (error) {
                logger.error("Error MongoDB getProducts: ",error)
            }
        }
    }
    //----------------------------------------------------------------
    
    async createNewProduct(product){
        try {
            // -------------- Validaciones producto ----------------------
            const itemMongoDB = await Productos.findOne({name: product.name})
            
            if (itemMongoDB) {
                logger.error("Producto con Nombre existente!! ")
                //return itemMongoDB
                return new Error(`Ya se encuentra creado el item ${itemMongoDB.name}`)
            } else {
                const newProduct = new Productos(product)
                await newProduct.save()
                logger.info('Product created')
                return newProduct
            }

        } catch (error) {
            logger.error("Error MongoDB createProduct: ",error)
        }
    }

    async updateProduct(id, producto){
        const itemMongoDB = await Productos.findById({_id: id})
        console.log('itemMongoDB (update): ',itemMongoDB)
        if (itemMongoDB) {
            try {
                 const newValues = {
                    name: producto.name,
                    description: producto.description,
                    price: producto.price,
                    code: producto.code,
                    picture: producto.picture,
                    stock: producto.stock,
                    timestamp: new Date(Date.now()).toLocaleString(),
                    category: producto.category
                }
                console.log('newValues (update): ',newValues)
                const productUpdated = await Productos.findOneAndUpdate(
                    { _id: id }, newValues , { new: true })
    
                logger.info('Producto actualizado ', productUpdated)
                
                return productUpdated
               
            } catch (error) {
                logger.error("Error MongoDB updateProduct: ",error)
            }
        } else {
            logger.info('El Producto no existe! ', itemMongoDB)
        }
    }

    async deleteProductById(id) {
        const itemMongoDB = await Productos.findById({_id: id})
        console.log('itemMongoDB (deleted): ',itemMongoDB)
        if(itemMongoDB) {
            try {
                const product = await Productos.findByIdAndDelete({_id: id})
                console.log('Producto encontrado y eliminado: ',product)
                return product
            } catch (error) {
                logger.error("Error MongoDB deleteProduct: ",error)
            }
        } else {
            logger.info('El Producto no existe! ', itemMongoDB)
        }
    }
    

    async getByNameOrCode(product) {
        
            try {
                const nameProduct = await Productos.findOne({ name: `${product}`}).exec();
                const codeProduct = await Productos.findOne({ code: `${product}`}).exec();
    
                if(nameProduct) {
                    //console.log('Producto encontrado getByName: ', nameProduct)
                    //logger.info('Producto encontrado getByName')
                    return nameProduct
                } else if (codeProduct) {
                    //console.log('Producto encontrado getByCode: ', codeProduct)
                    //logger.info('Producto encontrado getByCode')
                    return codeProduct
                } else {
                    return false
                }
            } catch (error) {
                logger.error("Error MongoDB getOneProduct: ",error)
            }
    }

    async disconnet() {
        await this.disconnection
    }
    
}

module.exports = ProductosDaoMongoDB