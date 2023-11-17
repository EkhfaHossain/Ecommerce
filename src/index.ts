import express from "express";
import productRoutes from "./routes/productRoutes";

const app = express();

app.use(express.json());

app.use("/", productRoutes);

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
