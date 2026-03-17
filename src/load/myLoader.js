// const pmap = require("p-map");
const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const pmap = require("p-map").default;


const ETLCustom = () => {
  const batchSize = 500;
  const CONCURRENT_REQUEST = 2;
  const totals = {};
  const startTime = Date.now();

  let batch = [];
  const stream = fs
    .createReadStream(path.join(__dirname, "../../data/orders.csv"))
    .pipe(csvParser());

  const processStream = async (batchList) => {
    const batchStart = Date.now();

    await pmap(
      batchList,
      async (row) => {
        const userId = row.userId;
        const amount = Number(row.amount);
        await new Promise((res) => setTimeout(res, 5));

        totals[userId] = (totals[userId] || 0) + amount;
      },

      { concurrency: CONCURRENT_REQUEST }
    );

    const batchEnd = Date.now();

    console.log(
      `Processed batch of ${batchList.length} in ${batchEnd - batchStart} ms`
    );
  };
  stream.on("data", async (row) => {
    batch.push(row);

    if (batch.length >= 500) {
      const currentBatch = batch;
      batch = [];
      stream.pause();
      await processStream(currentBatch);
      stream.resume();
    }
  });

  stream.on("end", async () => {
    if (batch.length > 0) {
      await processStream(batch);
    }

    const endTime = Date.now();

    console.log("Final totals:", totals);
    console.log(`Total processing time: ${endTime - startTime} ms`);
  });
};
ETLCustom();
