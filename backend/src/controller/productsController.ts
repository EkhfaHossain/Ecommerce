import { type Request, type Response } from "express";
import multer from "multer";
import fs from "fs";
import path, { parse } from "path";
import jwt, { JwtPayload } from "jsonwebtoken";
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

    let totalProducts: number = 0;
    let products;

    const minPrice = parseFloat(req.query.min as string);
    const maxPrice = parseFloat(req.query.max as string);
    const category = req.query.category as string;

    const where: any = {};

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      where.price = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    //console.log("Category:", category);

    where.categories = {
      equals: category,
    };

    totalProducts = await prisma.product.count({
      where: {
        categories: {
          contains: category,
        },
      },
    });

    products = await prisma.product.findMany({
      take: limit,
      skip: skip,
      where,
    });

    const totalPages = Math.ceil(totalProducts / limit);

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
    const { userId, quantity } = req.body;
    //console.log("User Id:", userId);
    //console.log("Quantity:", quantity);
    const parsedQuantity = parseInt(quantity);
    //console.log("Parsed Quantity:", parsedQuantity);
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.quantity < parsedQuantity) {
      return res.status(400).json({ error: "Product is out of stock" });
    }

    const transaction = await prisma.userProduct.create({
      data: {
        userId,
        productId,
        quantity: parsedQuantity,
      },
    });
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        quantity: {
          decrement: parsedQuantity,
        },
      },
    });
    res.status(200).json({ msg: "Successful!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Backend endpoint to get all purchases with customer details and associated products
export const getAllPurchasesByAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const productsBoughtByUsers = await prisma.userProduct.findMany({
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
            status: true,
          },
        },
      },
    });

    // Structure data to show purchases by all customers
    const purchasesByCustomers: any = {};

    productsBoughtByUsers.forEach((purchase) => {
      const customerId = purchase.user.id;

      if (!purchasesByCustomers[customerId]) {
        purchasesByCustomers[customerId] = {
          customer: {
            id: purchase.user.id,
            name: purchase.user.name,
            email: purchase.user.email,
          },
          products: [],
        };
      }

      purchasesByCustomers[customerId].products.push({
        id: purchase.product.id,
        title: purchase.product.title,
        status: purchase.product.status,
      });
    });

    const purchases = Object.values(purchasesByCustomers);

    res.status(200).json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserPurchasedProducts = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    //console.log("User Profile Token:", token);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken: any = jwt.verify(token, "ekh12") as JwtPayload;

    if (!decodedToken.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decodedToken.userId;

    const userPurchases = await prisma.userProduct.findMany({
      where: { userId },
      include: { product: true },
    });

    const products = userPurchases.map((userPurchase) => ({
      name: userPurchase.product.title,
      price: userPurchase.product.price,
      quantity: userPurchase.quantity,
      status: userPurchase.product.status,
    }));

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
