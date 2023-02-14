import Joi from '@hapi/joi'

function validarSchema(objeto, schema) {
    const validador = Joi.object(schema)
    const { error } = validador.validate(objeto)
    if (error) {
        return { result: false, error }
    } else {
        return { result: true }
    }
}

const productoSchema = {
    id: Joi.string(),
    timestamp: Joi.date(), //string(),
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().required(),
    picture: Joi.string(),
    code: Joi.string().required(),
    stock: Joi.number().required(),
    category: Joi.string().required(),
}

export function validarProducto(producto) {
    return validarSchema(producto, productoSchema)
}