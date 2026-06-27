/**
 * Role-based access control middleware.
 * Usage: adminOnly  → only role === "admin"
 *        authorizeRoles("admin", "employee") → either role
 */
function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ success: false, message: "Admin access required." });
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) return next();
    return res.status(403).json({ success: false, message: `Access restricted to: ${roles.join(", ")}` });
  };
}

module.exports = { adminOnly, authorizeRoles };
