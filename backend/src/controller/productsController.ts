import { type Request, type Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import pool from "../configs/db";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const products = await prisma.product.findMany({});

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const storage = multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, "public/images");
      },
      filename: (_req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });

    const upload = multer({ storage }).single("image");

    upload(req, res, async (err: any) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ error: "File upload error: " + err.message });
      } else if (err) {
        return res.status(400).json({ error: "File upload error" });
      }

      let imgUrl: string | null = null;

      if (req.file) {
        imgUrl = req.file.filename;
      }

      const { title, description, categories, quantity, price } = req.body;

      if (!title || !description || !categories || !quantity || !price) {
        return res
          .status(400)
          .json({ error: "Please provide all the required fields" });
      }

      const createProduct = await prisma.product.create({
        data: {
          title,
          description,
          categories,
          price: parseFloat(price), // Convert price to float if needed
          quantity: parseFloat(quantity), // Convert quantity to float if needed
          image: imgUrl || "",
        },
      });

      res.status(200).json(createProduct);
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const getImage = await pool.query(
      "SELECT image FROM product WHERE id = $1",
      [id]
    );
    const product = getImage.rows[0];
    const oldImgUrl = product.image;
    console.log("Old Image", oldImgUrl);

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

      let newImgUrl = req.file?.filename;

      // Triggers when there is no new image upload
      if (!newImgUrl) {
        newImgUrl = oldImgUrl;
      }
      // Triggers when a new Image is uploaded & Deleting the previous Image
      else {
        const imagePath = path.join(
          __dirname,
          "../../public/images",
          oldImgUrl
        );
        console.log(imagePath);

        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
              return res
                .status(500)
                .json({ error: "Error deleting image file" });
            }
            console.log("File deleted successfully");
          });
        } else {
          console.error("File not found:", imagePath);
        }
      }

      console.log("New Image: ", newImgUrl);

      const { title, description, categories, quantity, price } = req.body;
      const updateProduct = await pool.query(
        "UPDATE product SET title = $1, description = $2, categories = $3, quantity = $4, price = $5, image = $6 WHERE id = $7 RETURNING *",
        [title, description, categories, quantity, price, newImgUrl, id]
      );

      if (updateProduct.rowCount === 0) {
        return res.status(404).json({ error: "Product doesn't exist" });
      }

      res.status(200).json(updateProduct.rows[0]);
    });
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

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
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
