import mongoose from 'mongoose'
import app from './server.js'

const PORT = process.env.PORT || 4000
const url = 'mongodb+srv://germanClaudio:germanclaudio@cluster0.oqkw9q9.mongodb.net/ecommerce?retryWrites=true&w=majority' || process.env.MONGO_URL_CONNECT_ECOM

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err)
        throw new Error(`Error de conexión en la base de datos: ${err}`);

    console.log('Base de datos conectada!');

    const server = app.listen(PORT, () => {
        console.log(`Servidor express escuchando en el puerto ${server.address().port}`);
    });
    server.on('error', error => console.log(`Error en Servidor: ${error}`));
});
