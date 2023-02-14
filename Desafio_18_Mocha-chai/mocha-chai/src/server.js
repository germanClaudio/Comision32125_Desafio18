import express from 'express'

import RouterProductos from './rutas/productos.js'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/productos', new RouterProductos())

export default app
