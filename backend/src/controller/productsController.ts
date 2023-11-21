import { type Request, type Response } from "express";
import pool from "../configs/db";

export const testRoute = (req: Request, res: Response) => {
  try {
    res.send({ msg: "hello" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
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
};

export const getSingleProduct = async (req: Request, res: Response) => {
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
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, categories, quantity, price } = req.body;

    if (!title || !description || !categories || !quantity || !price) {
      return res
        .status(400)
        .json({ error: "Please provide all the required fields" });
    }

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
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { title, description, categories, quantity, price } = req.body;
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
};

export const deleteProduct = async (req: Request, res: Response) => {
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
};
