import mongoose from 'mongoose'
import supertest from 'supertest'
import { expect } from 'chai'
import { generar } from './generador/productos.js'
import app from '../src/server.js'

let request
let server

describe('Test API rest full', () => {

    before(async function () {
        await connectDb()
        server = await startServer()
        request = supertest(`http://localhost:${server.address().port}/api/productos`)
    })

    after(function () {
        mongoose.disconnect()
        server.close()
    })

    describe('GET', () => {
        it('Debería retornar un status 200', async () => {
            const response = await request.get('/')
            expect(response.status).to.eql(200)
        })
    })

    describe('POST', () => {
        it('Debería incorporar un producto', async () => {
            const producto = generar()
            console.log('Console.log producto para prueba: ', producto)
            const response = await request.post('/').send(producto)
            expect(response.status).to.eql(200)

            const product = response.body
            expect(product).to.include.keys('name', 'description', 'price', 'picture', 'code', 'stock', 'category')
            expect(product.name).to.eql(producto.name)
            expect(product.price).to.eql(producto.price)
            expect(product.stock).to.eql(producto.stock)
        })
    })
})

async function connectDb() {
    const url = 'mongodb+srv://germanClaudio:germanclaudio@cluster0.oqkw9q9.mongodb.net/ecommerce?retryWrites=true&w=majority'
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('Base de datos MONGO conectada!');
    } catch (error) {
        throw new Error(`Error de conexión en la base de datos: ${err}`)
    }
}

async function startServer() {
    return new Promise((resolve, reject) => {
        const PORT = 0
        const server = app.listen(PORT, () => {
            console.log(`Servidor express escuchando en el puerto ${server.address().port}`);
            resolve(server)
        });
        server.on('error', error => {
            console.log(`Error en Servidor: ${error}`)
            reject(error)
        });
    })
}