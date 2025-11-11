import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
