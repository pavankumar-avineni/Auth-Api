const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

  // 1. Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.json({ message: "Token missing" });
  }

  // 2. Remove 'Bearer '
  const token = authHeader.split(" ")[1];

  // 3. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Save user id for next use
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    // 5. Go to next step (route)
    next();

  } catch (error) {
    res.json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
