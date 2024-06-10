import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import asyncHandler from 'express-async-handler';
import AuthRepository from "../repositories/authRepository.js";

const secret = process.env.JWT_SECRET;
const authRepo = new AuthRepository();

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Ensure req.cookies is defined
  if (req.cookies) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });
    // console.log("🚀 ~ auth ~ user:", user)

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

const admin = (req, res, next) => {
  if (req.user.guard !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

const authenticateUser = async (req, res, next) => {
  // console.log("🚀 ~ authenticateUser ~ req.headers:", req.headers)
  // Extract the Authorization header from the request
  const authHeader = req.headers["authorization"];
  // console.log("🚀 ~ authenticateUser ~ authHeader:", authHeader)
  if (!authHeader) {
    // If no Authorization header is present, return Unauthorized status
    return res.status(401).json({ message: "Unauthorizedd" });
  }
  // Extract the JWT token from the Authorization header
  const token = authHeader.split(" ")[1];
  if (!token) {
    // If no token is found, return Unauthorized status
    return res.status(401).json({ message: "Unauthorizedd" });
  }
  try {
    //Get login details with token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      // Extract the user ID from the decoded token
      const { userId } = decoded;
      // Find the user based on the retrieved user ID
      const user = await authRepo.findById(userId);
      if (!user) {
        // If user not found, return Unauthorized status
        return res.status(401).json({ message: "Unauthorizedd" });
      }
      if (!req.session) {
        req.session = {}; // Ensure req.session is initialized
      }
      // console.log('user in authMiddleware:', user);
      req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        Role: user.role,
        guard: user.guard,
      }
      // Continue with the next middleware or route handler
      next();
    } else {
      // If decoding fails, return Unauthorized status
      return res.status(401).json({ message: "Unauthorizedd" });
    }
  } catch (error) {
    console.log(error);
    // If an error occurs during token verification, return Unauthorized status
    return res.status(401).json({ message: "it is Unauthorized" });
  }
};

// const authRole = (role) => {
//   return (req, res, next) => {
//     const userRole = req.session.user.guard;
//     console.log("🚀 ~ return ~ userRole:", userRole)
//     if (userRole !== role) {
//       return res.status(401).json({ message: "Unauthorized" })
//     }
//     next();
//   }
// }

const authRole = (role) => {
  return async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await authRepo.findById(decoded.userId);
    const userRole = user.guard;
    if (userRole !== role) {
      return res.status(401).json({ message: "The user does not have permission to do this operation" })
    }
    req.user = user;
    next();
  }
};

export { protect, auth, admin, authenticateUser, authRole };
