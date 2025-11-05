import express from "express";
import cors from "cors";

import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors()); // Allows Vue frontend to talk to this server
app.use(express.json()); // Allows server to read JSON from requests

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

app.listen(3001, () => {
  console.log("✅ Backend API running on http://localhost:3001");
});
