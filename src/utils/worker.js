const { parentPort } = require('worker_threads')

function heavyTransform(row) {
  // simulate CPU heavy task
  let result = 0

  for (let i = 0; i < 5_000_000; i++) {
    result += i
  }

  return { ...row, processed: true }
}

parentPort.on('message', (row) => {
  const result = heavyTransform(row)
  parentPort.postMessage(result)
})