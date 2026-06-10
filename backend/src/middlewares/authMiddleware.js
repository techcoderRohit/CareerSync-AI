const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];
  
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Access Denied: No Token Provided" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET");
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Access Denied: Invalid or Expired Token" });
  }
};

module.exports = authenticateToken;
