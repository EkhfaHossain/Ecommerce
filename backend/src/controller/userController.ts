import { PrismaClient } from "@prisma/client";
import { type Request, type Response } from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const testRoute = (req: Request, res: Response) => {
  try {
    console.log("Test route accessed");
    res.send({ msg: "User hello" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userRegistration = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userData = await prisma.user.findFirst({
      where: { email: email },
    });

    if (userData !== null) {
      if (await bcrypt.compare(password, userData.password)) {
        let user = {
          user_id: userData.id,
          user_name: userData.name,
          user_email: userData.email,
        };
        res.status(200).send(user);
      } else {
        res.status(401).send({ msg: "Invalid credentials" });
      }
    } else {
      res.status(404).send({ msg: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
