import jwt from "jsonwebtoken";

export function auth(requiredRoles = null) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
      req.user = decoded;
      req.token = token;

      if (requiredRoles && !requiredRoles.includes(decoded.roleId)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
