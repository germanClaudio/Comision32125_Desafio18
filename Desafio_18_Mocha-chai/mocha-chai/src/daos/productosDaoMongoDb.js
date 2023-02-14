import mongoose from 'mongoose'
import { jsSchema as productoSchema } from '../modelos/producto.model.js'
const Schema = mongoose.Schema

const productosDao = mongoose.model('Products', new Schema(productoSchema))

class DaoProductos {
    constructor() {
        return productosDao
    }
}

export default DaoProductos