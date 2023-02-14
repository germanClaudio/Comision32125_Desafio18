import DaoProductosMongoDb from './productosDaoMongoDb.js';
import DaoProductosMem from './productosDaoMem.js';

const persistencia = 'MONGO' || process.env.PERSISTENCIA || 'MEM'
console.log('Persistencia: ', persistencia)

let daoProductos
switch (persistencia) {
    case 'MONGO':
        daoProductos = new DaoProductosMongoDb()
        break
    default:
        daoProductos = new DaoProductosMem()
}

export { daoProductos }