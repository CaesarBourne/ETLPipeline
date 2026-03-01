// src/validator.js
function validateRow(row) {
  const errors = []

  if (!row.SKU) errors.push("Missing SKU")
  if (!row.Name) errors.push("Missing Name")
  if (!row.Price) errors.push("Missing Price")

  return errors
}

module.exports = { validateRow }