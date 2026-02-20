
const transforMapProduct = () => {}

const transformBatch =  (rows) => {
    return rows
            .map(transforMapProduct)
            .filter((row) => row.price > 0 && row.name)
}

module.exports = transformBatch;