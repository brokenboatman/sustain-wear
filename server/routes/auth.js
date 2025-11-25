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

      try {
        let user = await prisma.user.findUnique({ where: { googleId } });
        if (user) return done(null, user);

        user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          user = await prisma.user.update({
            where: { email },
            data: { googleId },
          });
          return done(null, user);
        }
        let baseUsername = email.split("@")[0];

        let uniqueUsername = baseUsername;
        let counter = 1;

        while (true) {
          const existingUser = await prisma.user.findUnique({
            where: { username: uniqueUsername },
          });

          if (!existingUser) break;
          uniqueUsername = `${baseUsername}${counter}`;
          counter++;
        }

        user = await prisma.user.create({
          data: {
            googleId,
            email,
            username: uniqueUsername,
            roleId: 1,
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
      return res.status(409).json({ error: "This email is already associated with another account" });
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
      user: { id: user.userId, email: user.email, username: user.username, roleId: user.roleId },
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

    const redirectUrl = new URL(`${process.env.FRONTEND_SERVER_URL}/auth/google/callback`);
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('userId', user.userId);
    redirectUrl.searchParams.set('username', user.username);
    redirectUrl.searchParams.set('roleId', user.roleId);

    res.redirect(redirectUrl.toString());
  }
);

router.post("/login", async (req, res) => {
  try {
    // --- STAGE 1: Input Extraction ---
    const { email, password, remember } = req.body;
    // --- STAGE 2: Validation ---
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // --- STAGE 3: User Lookup ---
    const user = await prisma.user.findUnique({ where: { email } });

    // If no user is found, return 401 (Unauthorized).

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // --- STAGE 4: Authentication Method Check ---
    if (!user.password) {
      return res.status(401).json({
        error:
          "This account was created with Google. Please use Google to log in.",
      });
    }
    // --- STAGE 5: Password Verification ---
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // --- STAGE 6: Token Generation (JWT) ---
    const expiresIn = remember ? "7d" : "12h";

    const token = jwt.sign(
      {
        id: user.userId,
        email: user.email,
        role: user.roleId,
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );
    // --- STAGE 7: Response ---
    res.json({
      message: "Logged in!",
      token,
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
      },
    });
  } catch (e) {
    // --- STAGE 8: Error Handling ---
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
