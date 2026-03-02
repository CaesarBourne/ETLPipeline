const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fashion',
  password: 'postgres',
  port: 5432,
})


async function getOrCreateBrand(name) {
  const result = await pool.query(
    `INSERT INTO brands(name)
     VALUES($1)
     ON CONFLICT(name)
     DO UPDATE SET name=EXCLUDED.name
     RETURNING id`,
    [name]
  )

  return result.rows[0].id
}

async function getOrCreateProduct(brandId, name) {
  const result = await pool.query(
    `INSERT INTO products(brand_id, name)
     VALUES($1,$2)
     ON CONFLICT DO NOTHING
     RETURNING id`,
    [brandId, name]
  )

  if (result.rows.length) return result.rows[0].id

  const existing = await pool.query(
    `SELECT id FROM products
     WHERE brand_id=$1 AND name=$2`,
    [brandId, name]
  )

  return existing.rows[0].id
}

async function upsertVariant(productId, variant) {
  await pool.query(
    `INSERT INTO variants(
       product_id, sku, size, color, price
     )
     VALUES($1,$2,$3,$4,$5)
     ON CONFLICT(product_id, sku)
     DO UPDATE SET
       price = EXCLUDED.price,
       size = EXCLUDED.size,
       color = EXCLUDED.color`,
    [
      productId,
      variant.sku,
      variant.size,
      variant.color,
      variant.price
    ]
  )
}



module.exports = { pool, getOrCreateBrand, getOrCreateProduct, upsertVariant }