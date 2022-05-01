const { Router } = require("express");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = Router();

router.post(
  "/registration",
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Некорректный passsword").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректный данные при регистрации",
        });
      }

      const { email, password } = req.body;
      const isUsed = await User.findOne({ email });

      if (isUsed) {
        return res.status(300).json({ message: "Данный email уже занят" });
      }

      const heashedPassword = await bcrypt.hash(password, 8);
      const user = new User({
        email,
        password: heashedPassword,
      });
      await user.save();
      res.status(201).json({ message: "Пользователь был создан" });
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Некорректный passsword").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректный данные при регистрации",
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Пользователя с таким email не существует" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Пароли не совпадают" });
      }
      const jwtSecret = "faefaehhrwafuuew";
      const token = jwt.sign(
        {
          userId: user._id,
        },
        jwtSecret,
        { expiresIn: "1h" }
      );

      res.json({ token, userId: user._id });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
