const pool = require("../config/db")

const loadProducts  = async (products) => {
    const client  = await pool.connect();

    try{
        await client.query("BEGIN")

        for(const p of products){
            await client.query(
                `INSERT INTO products(id,name,price,category,stock)
                VALUES($1,$2,$3,$4,$5)
                ON CONFLICT(id) DO UPDATE
                SET name=EXCLUDED.name,
                    price=EXCLUDED.price,
                    category=EXCLUDED.category,
                    stock=EXCLUDED.stock
                `,
                [p.id,p.name,p.price,p.category, p.stock]
            );
        }
        await client.query("COMMIT")

    }catch(err){
        client.query("ROLLBACK")
    }finally {
        client.release();
    }
}

module.exports = loadProducts;