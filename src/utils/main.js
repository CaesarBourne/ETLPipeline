const { Worker } = require('worker_threads')

function runWorker(row) {
  return new Promise((resolve, reject) => {

    const worker = new Worker('./worker.js')

    worker.postMessage(row)

    worker.on('message', resolve)
    worker.on('error', reject)
  })
}

async function start() {
  console.time("processing")

  await runWorker({ name: "shirt" })

  console.timeEnd("processing")
}

start()