import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import passport from "passport";
import fetchDonationsRoutes from "./routes/fetch-donations.js";
import fetchStaffDonationsRoutes from "./routes/staff-fetch-donations.js";
import addDonationRoutes from "./routes/add-donation.js";
import donationOptionsRoutes from "./routes/donation-options.js";
import fetchUserInfoRoutes from "./routes/fetch-userinfo.js";
import updateUserInfoRoutes from "./routes/update-userinfo.js";
import fetchDonation from "./routes/fetch-donation.js";
import updateDonation from "./routes/update-donation.js";
import donationImageRouter from "./routes/donation-image.js";
import deleteUser from "./routes/delete-user.js";

dotenv.config({ path: "../.env" });
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api/fetch-donations", fetchDonationsRoutes);
app.use("/api/staff-donations", fetchStaffDonationsRoutes);
app.use("/api/add-donation", addDonationRoutes);
app.use("/api/donation-options", donationOptionsRoutes);
app.use("/api/fetch-userinfo", fetchUserInfoRoutes);
app.use("/api/update-userinfo", updateUserInfoRoutes);
app.use("/api/fetch-donation", fetchDonation);
app.use("/api/update-donation", updateDonation);
app.use("/api/donation-image", donationImageRouter);
app.use("/api/delete-user", deleteUser);

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
