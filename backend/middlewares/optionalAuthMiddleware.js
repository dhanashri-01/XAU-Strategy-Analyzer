const { verifyOrDecodeToken } = require("./tokenService");

const optionalFirebaseAuth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next();
  }

  const token = authorization.slice("Bearer ".length).trim();
  try {
    req.user = await verifyOrDecodeToken(token);
    return next();
  } catch (error) {
    console.warn("Optional Firebase auth warning (proceeding unauthenticated):", error.message);
    return next();
  }
};

module.exports = optionalFirebaseAuth;
