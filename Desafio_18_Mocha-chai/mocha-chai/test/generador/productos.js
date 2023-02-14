import faker from 'faker'
faker.locale = 'es'

function generar() {
    return {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        timestamp: faker.date.past(),
        price: parseInt(faker.mersenne.rand(1000, 500)),
        picture: faker.image.avatar(),
        code: faker.random.alphaNumeric(4),
        stock: parseInt(faker.mersenne.rand(22, 3)),
        category: faker.lorem.word()
    }
}

export {
    generar
}