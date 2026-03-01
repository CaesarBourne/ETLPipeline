const fs = require('fs')
const csv = require('csv-parser')

let total = 0
let missingColor = 0
let duplicateCount = 0
let seen = new Set()

fs.createReadStream('products.csv')
  .pipe(csv())
  .on('data', (row) => {
    total++

    if (!row.Color) missingColor++

    if (seen.has(row.SKU)) duplicateCount++
    else seen.add(row.SKU)
  })
  .on('end', () => {
    console.log("Total rows:", total)
    console.log("Missing color:", missingColor)
    console.log("Duplicates:", duplicateCount)
  })