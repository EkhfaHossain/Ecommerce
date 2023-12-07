import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());
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
app.use("/", userRoutes);
app.use("/", productRoutes);

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
