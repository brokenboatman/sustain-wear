import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import fetchDonationsRoutes from "./routes/fetch-donations.js";
import fetchStaffDonationsRoutes from "./routes/staff-fetch-donations.js";
import addDonationRoutes from "./routes/add-donation.js";
import donationOptionsRoutes from "./routes/donation-options.js";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config({ path: "../.env" });
const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api/fetch-donations", fetchDonationsRoutes);
app.use("/api/fetch-staff-donations", fetchStaffDonationsRoutes);
app.use("/api/add-donation", addDonationRoutes);
app.use("/api/donation-options", donationOptionsRoutes);

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
