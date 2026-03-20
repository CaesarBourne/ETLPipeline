import fs from "fs";
import csv from "csv-parser";
import queue from "./queue";
// import { queue } from "./queue"

const BATCH_SIZE = 1000;
let batch = [];

const startTime = Date.now();

const stream = fs.createReadStream().pipe(csv());

stream.on("data", (row) => {
  batch.push(row);
  if (batch.length > BATCH_SIZE) {
    stream.pause();
    queue.add("new", batch, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    });
    console.log(`Queued batch of ${batch.length}`);
    batch = [];
    stream.resume();
  }
});

stream.on("end", () => {
  if (batch.length > BATCH_SIZE) {
    queue.add(
      "new",
      batch
      //     {
      //     attempts : 3,
      //     backoff : {
      //         delay: 3,
      //         type : "exponential"
      //     }
      // }
    );
    const endTime = Date.now();
    console.log(`Finished queuing in ${endTime - startTime} ms`);
  }
});
