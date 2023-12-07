import { PrismaClient } from "@prisma/client";
import { type Request, type Response } from "express";

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
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
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
      let user = {
        user_id: userData.id,
        user_name: userData.name,
        user_email: userData.email,
      };

      if (userData.password === password) {
        res.status(200).send(user);
      } else {
        res.status(401).send({ msg: "invalid", body: req.body });
      }
    } else {
      res.status(404).send({ msg: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
