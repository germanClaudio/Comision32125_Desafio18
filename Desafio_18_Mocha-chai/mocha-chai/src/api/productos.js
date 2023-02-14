import { validarProducto } from '../validaciones/index.js'
import { daoProductos } from '../daos/index.js'

export default class ApiProductos {
    constructor() {
        this.productosDao = daoProductos
    }

    async post(producto) {
        const { result, error } = validarProducto(producto)
        if (result) {
            try {
                const nuevoProducto = { ...producto, id: generarId() }
                await this.productosDao.create(nuevoProducto)
                console.log('Producto incorporado')
                return nuevoProducto
            } catch (error) {
                new Error(`error en escritura de usuario: ${error}`)
            }
        } else {
            throw new Error(error)
        }
    }

    async get(query = {}) {
        try {
            const productos = await this.productosDao.find(query)
            return productos
        } catch (error) {
            throw new Error(`error en lectura de productos: ${err}`)
        }
    }
}

function generarId(entityName = 'no_name') {
    return `${Date.now()}-${entityName}`
}