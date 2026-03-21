// const { Worker } = require("bullmq");


// const worker  =  new Worker("etl-pipeline",
//      (job) =>{
//     const batch  = job.data;
//     for (const job of batch) {
        
//     }
// }, {
//     connection : {host : "127.0.0.1", port : 6379},
//     concurrency : 5
// })

import { Worker } from "bullmq"
import IORedis from "ioredis"
import fs from "fs"

const redis = new IORedis()

// ✅ Shared writable stream (append mode)
const fileStream = fs.createWriteStream("totals.ndjson", {
  flags: "a"
})

const worker = new Worker(
  "etl-queue",
  async (job) => {
    const batch = job.data

    const localTotals = {}

    const start = Date.now()

    // 1️⃣ Aggregate batch locally
    for (const row of batch) {
      const userId = row.userId
      const amount = Number(row.amount)

      localTotals[userId] = (localTotals[userId] || 0) + amount
    }

    // 2️⃣ Write to file (NDJSON format)
    for (const userId in localTotals) {
      const record = JSON.stringify({
        userId,
        amount: localTotals[userId]
      })

      fileStream.write(record + "\n")
    }

    // 3️⃣ (Optional but recommended) store in Redis
    const pipeline = redis.pipeline()

    for (const userId in localTotals) {
      pipeline.hincrbyfloat("totals", userId, localTotals[userId])
    }

    await pipeline.exec()

    const end = Date.now()

    console.log(
      `Processed batch of ${batch.length} in ${end - start} ms`
    )
  },
  {
    connection: { host: "127.0.0.1", port: 6379 },
    concurrency: 5
  }
)

// graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing worker...")
  fileStream.end()
  await worker.close()
  process.exit(0)
})