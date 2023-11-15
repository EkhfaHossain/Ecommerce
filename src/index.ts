import express from "express";
import pool from "./db";

const app = express();

app.use(express.json());

//For testing
app.get("/hello", (req, res) => {
  try {
    res.send({ msg: "hello" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Getting all the Products
app.get("/products", async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM product");
    res.status(200).json(products.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Getting Single Product
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await pool.query(
      "SELECT * FROM product WHERE product_id = $1",
      [id]
    );
    res.status(200).json(product.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Creating Product
app.post("/product/create", async (req, res) => {
  try {
    const { name } = req.body;
    const product = await pool.query(
      "INSERT INTO product (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(200).json(product.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Updating Product
app.put("/product/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updateProduct = await pool.query(
      "UPDATE product SET name = $1 WHERE product_id = $2 RETURNING *",
      [name, id]
    );
    res.status(200).json(updateProduct.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Deleting Product
app.delete("/product/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await pool.query(
      "DELETE FROM product WHERE product_id = $1",
      [id]
    );
    res.status(200).json("Deleted Sucessfully!");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
