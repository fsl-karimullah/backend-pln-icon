const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../../models/User");

//register user
router.post(
  "/",
  check("username", "Username is required").notEmpty(),
  // check("roles", "Please select roles for users").notEmpty(),
  check("email", "Please input a valid email").isEmail(),
  check("phoneNum", "Please input a valid number phone")
    .isMobilePhone()
    .notEmpty(),
  check("password", "Please enter password with 6 or more characters").isLength(
    { min: 6 }
  ),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, roles, phoneNum } = req.body;

    try {
      //check users
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
      }
      // //create avatar
      // const avatar = normalize(
      //   gravatar.url(email, {
      //     s: "200",
      //     r: "pg",
      //     d: "mm",
      //   }),
      //   { forceHttps: true }
      // );

      user = new User({
        username,
        email,
        password,
        roles,
        phoneNum,
      });

      //hash password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //generate jwt
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
