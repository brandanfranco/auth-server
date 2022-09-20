const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

const createNewUser = async (req, res = response) => {
  const { email, name, password } = req.body;

  try {
    // verify email

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        message: "Email already exists",
      });
    }

    //create user with model name

    const dbUser = new User(req.body);
    //password hashed

    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);

    // generate JWT token

    const token = await generateJWT(dbUser.id, dbUser.name);

    // create user in DB and save

    await dbUser.save();

    //Success return

    return res.status(201).json({
      ok: true,
      uid: dbUser._id,
      name,
      message: "Successfully created",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: "Please contact with ADMIN",
    });
  }

  res.json({
    ok: true,
    message: "new User ",
  });
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        message: "User not found",
      });
    }

    // confirm password

    const dbPassword = bcrypt.compareSync(password, dbUser.password);

    if (!dbPassword) {
      return res.status(400).json({
        ok: false,
        message: "Password is incorrect",
      });
    }

    //generate jsonwebtoken

    const token = await generateJWT(dbUser.id, dbUser.name);

    return res.json({
      ok: true,
      uid: dbUser._id,
      name: dbUser.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Please contact ADMIN",
    });
  }
};

const renewJsonWebToken = async (req, res = response) => {
  const { uid, name } = req;

  const token = await generateJWT(uid, name);
  res.json({
    ok: true,
    uid,
    name,
  });
};

module.exports = { createNewUser, loginUser, renewJsonWebToken };
