const fs = require('fs');
const csv = require('csv-parser');
const { resolve } = require('path');

const extractCSV = (filePath) => {
    const rows = []

    return new Promise((resolve, reject) => {

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => rows.push(data))
            .on("end", () => resolve(rows))
            .on("error", reject)
    });

}

module.exports = extractCSV