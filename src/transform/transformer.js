// src/transformer.js
function normalizeSize(size) {
  if (!size) return null

  const map = {
    xl: "XL",
    l: "L",
    m: "M",
    s: "S"
  }

  return map[size.toLowerCase()] || size.toUpperCase()
}

function normalizePrice(price) {
  // handle "59,99"
  const cleaned = price.replace(",", ".")
  return parseFloat(cleaned)
}

function transformRow(row, brandId) {
  return {
    brandId,
    sku: row.SKU.trim(),
    name: row.Name.trim(),
    color: row.Color?.trim().toUpperCase() || "UNKNOWN",
    size: normalizeSize(row.Size),
    price: normalizePrice(row.Price),
    currency: "EUR"
  }
}

module.exports = { transformRow }