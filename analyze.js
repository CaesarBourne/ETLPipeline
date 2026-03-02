// const fs = require('fs')
// const csv = require('csv-parser')

// let total = 0
// let missingColor = 0
// let duplicateCount = 0
// let seen = new Set()

// fs.createReadStream('products.csv')
//   .pipe(csv())
//   .on('data', (row) => {
//     total++

//     if (!row.Color) missingColor++

//     if (seen.has(row.SKU)) duplicateCount++
//     else seen.add(row.SKU)
//   })
//   .on('end', () => {
//     console.log("Total rows:", total)
//     console.log("Missing color:", missingColor)
//     console.log("Duplicates:", duplicateCount)
//   })
// src/index.js
const { readCSV } = require('./reader')
const { validateRow } = require('./validator')
const { transformRow } = require('./transformer')

const brandId = "brand_1"

let processed = 0
let failed = 0
let duplicates = 0

const seen = new Set()

readCSV('../products.csv',
  (row) => {
    processed++

    const errors = validateRow(row)
    if (errors.length) {
      failed++
      console.log("Invalid row:", errors)
      return
    }

    if (seen.has(row.SKU)) {
      duplicates++
      return
    }

    seen.add(row.SKU)

    const transformed = transformRow(row, brandId)
    console.log(transformed)
  },
  () => {
    console.log("Done")
    console.log("Processed:", processed)
    console.log("Failed:", failed)
    console.log("Duplicates:", duplicates)
  }
)