import { type Request, type Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const testRoute = (req: Request, res: Response) => {
  try {
    res.send({ msg: "hello Product" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    let totalProducts;
    let products;

    const minPrice = parseFloat(req.query.min as string) || 0;
    const maxPrice = parseFloat(req.query.max as string) || Infinity;
    // console.log("Page:", page);
    // console.log("Limit:", limit);
    // console.log("Skip:", skip);
    // console.log("Min Price:", minPrice);
    // console.log("Max Price:", maxPrice);

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      totalProducts = await prisma.product.count();
      products = await prisma.product.findMany({
        take: limit,
        skip: skip,
      });

      // console.log("Products:", products);
    } else {
      totalProducts = await prisma.product.count({
        where: {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      });

      products = await prisma.product.findMany({
        take: limit,
        skip: skip,
        where: {
          price: {
            gte: minPrice,
            lte: maxPrice, // Use the actual variable `maxPrice` here
          },
        },
      });

      // console.log("Products:", products);
    }

    const totalPages = Math.ceil(totalProducts / limit);
    //console.log("Total Pages:", totalPages);

    res.status(200).json({
      products: products,
      totalPages: totalPages,
      currentPage: page,
    });
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
      try {
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
      } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productImage = await prisma.product.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      select: {
        image: true,
      },
    });

    let oldImgUrl = productImage?.image || "";
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

      let newImgUrl = req.file?.filename || oldImgUrl;
      if (req.file) {
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

      const updatedProduct = await prisma.product.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          title,
          price: parseFloat(price),
          description,
          categories,
          quantity: parseFloat(quantity),
          image: newImgUrl,
        },
      });

      res.status(200).json(updatedProduct);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productImage = await prisma.product.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      select: {
        image: true,
      },
    });
    const imgUrl = productImage?.image || "";
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

    const deleteProduct = await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(200).json("Deleted Sucessfully!");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const buyProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const { userId } = req.body;
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.quantity <= 0) {
      return res.status(400).json({ error: "Product is out of stock" });
    }

    const transaction = await prisma.userProduct.create({
      data: {
        userId,
        productId,
      },
    });
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });
    res.status(200).json({ msg: "Successful!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPurchases = async (req: Request, res: Response) => {
  try {
    const productsBoughtbyUser = await prisma.userProduct.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    const purchases = productsBoughtbyUser.map((products) => {
      return {
        customer: {
          id: products.user.id,
          name: products.user.name,
          email: products.user.email,
        },
        product: {
          id: products.product.id,
          name: products.product.title,
        },
      };
    });
    res.status(200).json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
