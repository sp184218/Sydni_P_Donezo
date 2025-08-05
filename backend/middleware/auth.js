// middleware/auth.js
import jwt from 'jsonwebtoken';

// Middleware to verify JWT token in Authorization header
const verifyToken = (req, res, next) => {
  // Expect header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify token using secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload (e.g., user id) to req.user for downstream use
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Invalid token:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default verifyToken;

