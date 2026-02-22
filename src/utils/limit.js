import pLimit from "p-limit";

const limit = pLimit(5);

await Promise.all(
  products.map(product =>
    limit(() => processProduct(product))
  )
);