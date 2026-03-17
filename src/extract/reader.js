const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')

function readCSV(path, onRow, onEnd) {
  fs.createReadStream(path)
    .pipe(csv())
    .on('data', onRow)
    .on('end', onEnd)
}

const readData = (filePath) =>{
  fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) =>{
    console.log(row)
  })
  .on("end", () =>{
    console.log("I am done");
  })
}


readData(path.join(__dirname, "../../data/products.csv"))

// import fs from "fs"
// import csv from "csv-parser"
// import { pipeline } from "stream"

// const totals: Record<string, number> = {}

// const transformStream = new (require("stream").Transform)({
//   objectMode: true,

//   transform(row, _, callback) {

//     const userId = row.userId
//     const amount = Number(row.amount)

//     totals[userId] = (totals[userId] || 0) + amount

//     callback(null, row)
//   }
// })

// pipeline(
//   fs.createReadStream("transactions.csv"),
//   csv(),
//   transformStream,
//   (err) => {
//     if (err) {
//       console.error("Error:", err)
//     } else {
//       console.log("Result:", totals)
//     }
//   }
// )
// module.exports = {  readData}