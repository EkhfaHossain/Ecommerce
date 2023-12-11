import { PrismaClient } from "@prisma/client";
import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        isManual: true,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const googleUserRegistration = async (req: Request, res: Response) => {
  try {
    const { email, name, aud } = req.body;
    const googleAuthUser = await prisma.user.upsert({
      where: {
        email: email,
      },
      update: {
        name: name,
        token: aud,
        isManual: false,
        password: aud,
      },
      create: {
        email: email,
        name: name,
        token: aud,
        isManual: false,
        password: aud,
      },
    });

    res.status(200).json(googleAuthUser);
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
        const token = jwt.sign({ userId: userData.id }, "ekh12", {
          expiresIn: "1h",
        });

        res.cookie("token", token, {
          httpOnly: true,
        });

        res.status(200).json({
          message: "Login Successful!",
          token,
        });
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

export const userLogOut = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

export const userPasswordReset = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
};
