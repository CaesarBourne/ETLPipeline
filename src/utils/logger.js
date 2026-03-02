function log(level, message, meta = {}) {
  console.log(JSON.stringify({
    level,
    message,
    meta,
    time: new Date().toISOString()
  }))
}

module.exports = {
  info: (msg, meta) => log("INFO", msg, meta),
  error: (msg, meta) => log("ERROR", msg, meta),
}