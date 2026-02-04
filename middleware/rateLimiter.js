const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,             // ONLY 3 request allowed
  handler: (req, res) => {
    console.log("🚨 RATE LIMIT HIT");
    res.status(429).json({
      message: "RATE LIMIT BLOCKED"
    });
  }
});

module.exports = limiter;
