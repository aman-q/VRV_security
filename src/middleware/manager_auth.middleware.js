import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
export const managerMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "No token, authorization denied",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "Manager") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Manager only.",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: err.name === "TokenExpiredError" ? "Token expired" : "Token invalid",
    });
  }
};
