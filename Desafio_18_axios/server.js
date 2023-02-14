const express = require('express')
const logger = require('morgan')
const session = require('express-session')
const path = require('path')

require('dotenv').config( {
    path: process.env.MODO === 'dev'
    ? path.resolve(__dirname, '.env')
    : path.resolve(__dirname, '.env')
 })

const cors = require('cors')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const routerUsers = require('./Routes/usuarios.route.js')
const routerProductos = require('./Routes/productos.route.js')
const routerCarts = require('./Routes/carts.route.js')

const { infoRouter } = require('./Routes/info.routes.js')
const { authRouter } = require('./Routes/auth.routes.js')

const initSocket = require('./utils/initSocket.js')
//______________________________ mongo para session ______________________________ //
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

//________________________________________________________________________________ //
const passport = require('passport')
const { initPassport } = require('./middlewares/passport.js')
//________________________________________________________________________________ //

// const parseArgs = require('minimist')
// const args = parseArgs(process.argv.slice(2))
//     console.log('args: ', args)

// -------------------- Axios -------------------------------

const initServer = () => {    

    const app = express()
    const httpServer = new HttpServer(app)
    const io = new IOServer(httpServer)

    /////////////////////// configuracion de EJS /////////////////////////
    app.set('view engine', 'ejs')
    app.set('views', __dirname + '/public/views/pages') 

    //////////////  middleware  ///////////////////////
    
    app.use(session({
        secret: process.env.SECRET_KEY_SESSION,    
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL_CONNECT,
            mongoOptions: advancedOptions,
        }),
        httpOnly: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 1,
        },
        resave: true, 
        saveUninitialized: true
    }))

    initPassport()
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(express.static('public'))
    app.use(express.static('src/images'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())
    app.use(logger('dev'))
        
    ////////////////////// Rutas //////////////////////////////    
    app.use('/api/productos', routerProductos)
    app.use('/api/auth', authRouter)
    app.use('/', infoRouter)
    app.use('/getUsers', routerUsers)
    app.use('/api/carts', routerCarts)
    ////////////////////////////////////////////////////////

//_____________________________________________ socket.io _____________________________________ //   
    initSocket(io)
//______________________________________________________________________________________________//

    return {
        listen: port => new Promise((res, rej)=>{
            const server = httpServer.listen(port, () => {
                res(server)
            })
            server.on('error', err => rej(err))
        })
    }
}

module.exports = initServer