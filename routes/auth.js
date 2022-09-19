const { Router } = require("express");
const { check } = require("express-validator");
const { validation } = require("../middlewares/validation");

const {
  createNewUser,
  loginUser,
  renewJsonWebToken,
} = require("../controllers/auth.controllers");

const router = Router();

// Create new User
router.post(
  "/new",
  [
    check("name", "Name is  required").not().isEmpty(),
    check("email", "Email is  required").isEmail(),
    check("password", "Password is  required").isLength({ min: 6 }),
  ],
  validation,
  createNewUser
);

// login user
router.post(
  "/",
  [
    check("email", "Email required").isEmail(),
    check("password", "Password required").isLength({ min: 6 }),
  ],
  validation,
  loginUser
);

// validation renew
router.get("/renew", renewJsonWebToken);

module.exports = router;
