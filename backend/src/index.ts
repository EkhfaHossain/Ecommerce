import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:9090"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use("/", productRoutes);

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
