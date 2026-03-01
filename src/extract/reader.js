// src/reader.js
const fs = require('fs')
const csv = require('csv-parser')

function readCSV(path, onRow, onEnd) {
  fs.createReadStream(path)
    .pipe(csv())
    .on('data', onRow)
    .on('end', onEnd)
}

module.exports = { readCSV }