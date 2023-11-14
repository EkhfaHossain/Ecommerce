import express from "express";
import pool from "../db";

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

// Getting the Product
app.get("/products", async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM product");
    res.send(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// creating product
app.post("/create", async (req, res) => {
  try {
    const { name } = req.body;
    const product = await pool.query(
      "INSERT INTO product (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.send(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
