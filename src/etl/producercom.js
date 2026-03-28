import fs from "fs"
import path from "path"
import csv from "csv-parser"
import queue from "./queue.js"
import { fileURLToPath } from "url"

// ============================================
// ES Module __dirname workaround
// In ES Modules, __dirname is not available
// We create it manually using import.meta.url
// ============================================
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================
// Configuration
// ============================================
const BATCH_SIZE = 1000 // Number of rows per batch
let batch = [] // Temporary storage for current batch
let isProcessing = false // Flag to prevent race conditions

const startTime = Date.now()

// ============================================
// Create read stream and pipe through CSV parser
// This reads the CSV file row by row
// ============================================
const stream = fs
  .createReadStream(path.join(__dirname, "../../data/orders.csv"))
  .pipe(csv())

// ============================================
// Handle each row of data
// Race condition fix: use isProcessing flag
// to ensure we don't process multiple batches
// simultaneously which could cause data loss
// ============================================
stream.on("data", async (row) => {
  // Add row to current batch
  batch.push(row)

  // Check if batch is full AND not already processing
  // >= instead of > to include exact BATCH_SIZE
  if (batch.length >= BATCH_SIZE && !isProcessing) {
    // Set flag to prevent race condition
    isProcessing = true

    // Store current batch (before resetting)
    // This prevents data loss if new rows arrive
    const currentBatch = batch
    batch = [] // Reset batch immediately

    // Pause stream to apply backpressure
    // This prevents memory overflow with large files
    stream.pause()

    try {
      // Add batch to BullMQ queue
      // queue.add() is async - we MUST await it
      await queue.add("process-batch", currentBatch, {
        attempts: 3, // Retry up to 3 times on failure
        backoff: {
          type: "exponential", // Wait longer between each retry
          delay: 1000 // Start with 1 second delay
        }
      })

      console.log(`✅ Queued batch of ${currentBatch.length} rows`)
    } catch (error) {
      console.error(`❌ Failed to queue batch:`, error.message)
      // Optionally: re-add failed rows back to batch
      // batch = [...currentBatch, ...batch]
    } finally {
      // Always reset flag and resume stream
      isProcessing = false
      stream.resume()
    }
  }
})

// ============================================
// Handle end of file
// Process any remaining rows in the batch
// Bug fix: condition was batch.length > BATCH_SIZE
// Should be batch.length > 0 to catch remaining rows
// ============================================
stream.on("end", async () => {
  // Process remaining rows (if any)
  if (batch.length > 0) {
    try {
      await queue.add("process-batch", batch, {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000
        }
      })

      console.log(`✅ Queued final batch of ${batch.length} rows`)
    } catch (error) {
      console.error(`❌ Failed to queue final batch:`, error.message)
    }
  }

  const endTime = Date.now()
  console.log(`🏁 Finished queuing in ${endTime - startTime} ms`)

  // Close the queue connection gracefully
  await queue.close()
})

// ============================================
// Handle stream errors
// ============================================
stream.on("error", (err) => {
  console.error("❌ Stream error:", err.message)
})