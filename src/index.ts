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

    if (products.rowCount === 0) {
      return res.status(404).json({ message: "No products found" });
    }

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

    if (product.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Creating Product
app.post("/product/create", async (req, res) => {
  try {
    const { title, description, categories, quantity, price } = req.body;

    const product = await pool.query(
      "INSERT INTO product (title, description, categories, quantity, price) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, categories, quantity, price]
    );

    if (product.rowCount === 0) {
      return res.status(500).json({ error: "Failed to create product" });
    }

    res.status(200).json(product.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// For Updating Product
app.put("/product/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, categories, quantity, price } = req.body;

  try {
    const updateProduct = await pool.query(
      "UPDATE product SET title = $1, description = $2, categories = $3, quantity = $4, price = $5 WHERE product_id = $6 RETURNING *",
      [title, description, categories, quantity, price, id]
    );

    if (updateProduct.rowCount === 0) {
      return res.status(404).json({ error: "Product doesn't exist" });
    }

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

    if (deleteProduct.rowCount === 0) {
      return res.status(404).json({ error: "Product doesn't exist" });
    }

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
