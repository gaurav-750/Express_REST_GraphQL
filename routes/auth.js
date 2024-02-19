const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");
const User = require("../models/user");
const { isAuthenticated } = require("../middleware/is-auth");

// POST /auth/signup
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error("Email already exists");
        }

        return true;
      }),

    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password must be atleast 4 characters long"),

    body("name").trim().not().isEmpty().withMessage("Name is required"),
  ],
  authController.signup
);

router.post("/login", authController.login);

router.get("/status", isAuthenticated, authController.getUserStatus);
router.patch(
  "/status",
  isAuthenticated,
  [body("status").trim().not().isEmpty()],
  authController.updateUserStatus
);

module.exports = router;
