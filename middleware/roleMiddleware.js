function roleMiddleware(requiredRole) {

  return function (req, res, next) {

    const userRole = req.userRole;

    if (userRole !== requiredRole) {
      return res.json({ message: "Access denied" });
    }

    next();
  };
}

module.exports = roleMiddleware;