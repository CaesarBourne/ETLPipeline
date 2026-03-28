// // src/index.js

// const { readCSV } = require("./extract/reader")
// const { transformRow } = require("./transform/transformer")
// const { validateRow } = require("./validator/validator")


// const brandId = "brand_1"

// let processed = 0
// let failed = 0
// let duplicates = 0

// const seen = new Set()

// readCSV('../data/products.csv',
//   (row) => {
//     processed++

//     const errors = validateRow(row)
//     if (errors.length) {
//       failed++
//       console.log("Invalid row:", errors)
//       return
//     }

//     if (seen.has(row.SKU)) {
//       duplicates++
//       return
//     }

//     seen.add(row.SKU)

//     const transformed = transformRow(row, brandId)
//     console.log(transformed)
//   },
//   () => {
//     console.log("Done")
//     console.log("Processed:", processed)
//     console.log("Failed:", failed)
//     console.log("Duplicates:", duplicates)
//   }
// )

const extractCSV = require("./extract/csvExtractor");
const transformBatch = require("./transform/productTransformer");
const loadProducts = require("./load/productLoader");
const logger = require("./utils/logger");

const runPipeline = async () => {
  try {
    logger.info("Starting ETL Pipeline");

    const rawData = await extractCSV("./data/products.csv");

    logger.info(`Extracted ${rawData.length} rows`);

    const transformed = transformBatch(rawData);

    logger.info(`Transformed ${transformed.length} rows`);

    await loadProducts(transformed);

    logger.info("ETL Pipeline completed successfully");
  } catch (error) {
    logger.error("Pipeline failed", error);
  }
};

runPipeline();