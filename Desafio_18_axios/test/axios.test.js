const axios = require('axios').default
const mongoose = require('mongoose')
const app = require('../app.js')

;(async () => {
    const url = 'mongodb+srv://germanClaudio:germanclaudio@cluster0.oqkw9q9.mongodb.net/ecommerce?retryWrites=true&w=majority'
    try {   
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        , err => {
        if (err)
                throw new Error(`Error de conexión en la base de datos: ${err}`);
                console.log('Base de datos conectada!');
                const server = app.listen(PORT, () => {
                console.log(`Servidor express escuchando en el puerto ${server.address().port}`);
            });
        }
    
 } catch(error) {
    console.log(`Error en Servidor: ${error}`)
 }
})()

const url = 'http://localhost:4000/api/productos'   //'https://jsonplaceholder.typicode.com/posts'

;(async ()=>{
    await axios.get(url)
    .then(resp => console.log('Products Request: ', resp.data))
})()

;(async ()=>{
    const urlId = 'http://localhost:4000/api/productos/635fd425d284f5279602c78f'
    axios.get(urlId)
    .then(resp => console.log('Product: ',resp.data))
})()

;(async ()=>{
    await axios.post(url, {
        "timestamp": "",
        "name": "Producto 229",
        "description": "Perfume IX",
        "price": 900,
        "picture": "https://m.media-amazon.com/images/I/51XS20NbJnL._AC_UL320_.jpg",
        "stock": 9,
        "code": "AA19",
        "category": "Perfumes"
    })
    .then(resp => console.log(resp.data))
})()