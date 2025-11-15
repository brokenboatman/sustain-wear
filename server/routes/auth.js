import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const router = Router();
const DEFAULT_ROLE_ID = 1;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_SERVER_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      const displayName = profile.displayName;

      try {
        let user = await prisma.user.findUnique({
          where: { googleId: googleId },
        });

        if (user) {
          return done(null, user);
        }

        user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (user) {
          user = await prisma.user.update({
            where: { email: email },
            data: { googleId: googleId },
          });
          return done(null, user);
        }

        user = await prisma.user.create({
          data: {
            googleId: googleId,
            email: email,
            username: displayName,
            roleId: DEFAULT_ROLE_ID,
          },
        });
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const roleId = parseInt(req.body.roleId);
    if (!email || !password || !username || !roleId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail)
      return res.status(409).json({ error: "User already exists" });
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername)
      return res.status(409).json({ error: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        username,
        roleId,
      },
    });

    res.json({
      message: "Registered!",
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_SERVER_URL}/login?error=true`,
  }),

  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      {
        id: user.userId,
        email: user.email,
        role: user.roleId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(
      `${process.env.FRONTEND_SERVER_URL}/auth/google/callback?token=${token}`
    );
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!user.password) {
      return res.status(401).json({
        error:
          "This account was created with Google. Please use Google to log in.",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: user.userId,
        email: user.email,
        role: user.roleId,
      },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "12h" }
    );

    res.json({
      message: "Logged in!",
      token,
      user: {
        id: user.userId,
        email: user.email,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
