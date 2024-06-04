import jwt from "jsonwebtoken";
import AuthRepository from "../repositories/authRepository.js";
const authRepo = new AuthRepository();
/**
 * @DESC Verify JWT from authorization header Middleware
 * This middleware checks for a valid JWT in the Authorization header,
 * verifies its authenticity, and retrieves the associated user information.
 */
const authenticateUser = async (req, res, next) => {
    // Extract the Authorization header from the request
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        // If no Authorization header is present, return Unauthorized status
        return res.status(401).json({ message: "Unauthorized" });
    }
    // Extract the JWT token from the Authorization header
    const token = authHeader.split(" ")[1];
    if (!token) {
        // If no token is found, return Unauthorized status
        return res.status(401).json({ message: "Unauthorized" });
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
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (!req.session) {
                req.session = {}; // Ensure req.session is initialized
            }
            console.log(user);
            req.session.user = {
                id: user._id,
                name: user.name,
                email: user.email,
                Role: user.role,
            }
            // Continue with the next middleware or route handler
            next();
        } else {
            // If decoding fails, return Unauthorized status
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        console.log(error);
        // If an error occurs during token verification, return Unauthorized status
        return res.status(401).json({ message: " it is Unauthorized" });
    }
};

export { authenticateUser };