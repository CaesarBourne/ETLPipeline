const pool = require('../config/db')
const { v4: uuid } = require('uuid')

async function createJob(brandId) {
  const jobId = uuid()

  await pool.query(
    `INSERT INTO etl_jobs(id, brand_id, status)
     VALUES($1,$2,'running')`,
    [jobId, brandId]
  )

  return jobId
}

async function updateJobStatus(jobId, status) {
  await pool.query(
    `UPDATE etl_jobs
     SET status=$2, finished_at=NOW()
     WHERE id=$1`,
    [jobId, status]
  )
}

module.exports = { createJob, updateJobStatus }