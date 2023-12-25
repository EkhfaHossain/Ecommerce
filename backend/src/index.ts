import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import { authenticateAndAuthorizeMiddleware } from "./middleware/authMiddleWare";

const app = express();
app.use(cookieParser());
app.use(express.json());

// app.use((req, res, next) => {
//   console.log("Cookies:", req.cookies);
//   next();
// });

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:9090"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
// serve static files from public folder
app.use(express.static("public"));
app.use("/images", express.static("images"));

app.use("/", productRoutes);
app.use("/", userRoutes);

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
