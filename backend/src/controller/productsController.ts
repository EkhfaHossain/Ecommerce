import { type Request, type Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
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
    const product = await pool.query("SELECT * FROM product WHERE id = $1", [
      id,
    ]);

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
    // File upload handling
    const storage = multer.diskStorage({
      destination: function (_req, _file, cb) {
        cb(null, "public/images");
      },
      filename: function (_req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });

    const upload = multer({ storage }).single("image");

    upload(req, res, async function (err: any) {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ error: "File upload error: " + err.message });
      } else if (err) {
        return res.status(400).json({ error: "File upload error" });
      }
      const imgUrl = req.file?.filename;

      const { title, description, categories, quantity, price } = req.body;

      if (!title || !description || !categories || !quantity || !price) {
        return res
          .status(400)
          .json({ error: "Please provide all the required fields" });
      }

      const insertQuery =
        "INSERT INTO product (title, description, categories, quantity, price, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
      const values = [title, description, categories, quantity, price, imgUrl];

      // Execute the database query
      pool.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error("Error inserting product:", err);
          return res.status(500).json({ error: "Failed to create product" });
        }

        const createdProduct = result.rows[0];
        res.status(200).json(createdProduct);
      });
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { image, title, description, categories, quantity, price } = req.body;
    const updateProduct = await pool.query(
      "UPDATE product SET title = $1, description = $2, categories = $3, quantity = $4, price = $5, image = $6 WHERE id = $7 RETURNING *",
      [title, description, categories, quantity, price, image, id]
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
    const getImage = await pool.query(
      "SELECT image FROM product WHERE id = $1",
      [id]
    );
    const product = getImage.rows[0];
    if (!product || !product.image) {
      return res
        .status(404)
        .json({ error: "Product not found or image URL missing" });
    }

    const imgUrl = product.image;
    console.log(imgUrl);
    const imagePath = path.join(__dirname, "../../public/images", imgUrl);
    console.log(imagePath);

    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).json({ error: "Error deleting image file" });
        }
        console.log("File deleted successfully");
      });
    } else {
      console.error("File not found:", imagePath);
    }

    const deleteProduct = await pool.query(
      "DELETE FROM product WHERE id = $1",
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
