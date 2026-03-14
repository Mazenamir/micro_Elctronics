const jwt = require("jsonwebtoken");
const authMiddelware = async (req, res, next) => {  // Middleware to check if the user is authenticated and has admin role
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) return res.status(401).json({ msg: "Token Not Found!! Unauthorized" }); // Send unauthorized response if no authorization header is present

        const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token and decode it

        req.user = decodedToken; // Attach decoded user information to the request object for use in subsequent middleware or route handlers

        next(); // Call next middleware or route handler

    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: "Unauthorized" }); // Send unauthorized response if token is invalid or missing
    }
};

module.exports = authMiddelware;

