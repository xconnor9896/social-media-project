const UserModel = require('../models/UserModel');
const FollowerModel = require('../models/FollowerModel');
const ProfileModel = require('../models/ProfileModel');
const userNameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim;
const defaultProfilePic = require('../util/defaultProfilePic');


const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');

const getUsernameAvailable = async (req, res) => {
  const { username } = req.params;
  try {
    if (username.length < 1) return res.status(401).send(`This username is too short!`)
    const test = userNameRegex.test(username);
    if (!(test || userNameRegex.test(username))) {
      return res.status(401).send('This username is invalid!')
    }
    const user = await UserModel.findOne({
      username: username.toLowerCase()
    })
    if (user) return res.status(401).send(`Sorry, this username is already taken!`)

    return res.status(200).send(`Available`)

  } catch (error) {
    res.status(500).send(`Uh oh! Server error!`);
  }
}

const createUser = async (req, res) => {
  const {
    name,
    email,
    username,
    password,
    bio,
    facebook,
    instagram,
    twitter,
    youtube
  } = req.body.user;

  if (!isEmail(email)) return res.status(401).send("This email doesn't work!")
  if (password.length < 6) return res.status(401).send("Your password is too short! It has to be at least six characters.")

  try {
    let user;
    user = await UserModel.findOne({ email: email.toLowerCase() });
    if (user) return res.status(401).send("This email is already in use.")

    user = new UserModel({
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
      profilePicURL: req.body.profilePicURL || defaultProfilePic
    });

    user.password = await bcrypt.hash(password, 10);
    user = await user.save();

    let profileFields = {};
    profileFields.user = user._id;
    if (bio) profileFields.bio = bio;
    if (twitter) profileFields.twitter = twitter;
    if (youtube) profileFields.youtube = youtube;
    if (instagram) profileFields.instagram = instagram;
    if (facebook) profileFields.facebook = facebook;

    await new ProfileModel(profileFields).save();
    await new FollowerModel({
      user: user._id,
      followers: [],
      following: []
    }).save();

    const payload = { userId: user._id };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '2d' },
      (error, token) => {
        if (error) throw error;
        res.status(200).json(token);
      }
    )

  } catch (error) {
    console.log(error);
    return res.status(500).send("Uh oh! Server error!")
  }
}

const postLoginUser = async (req, res) => {

  const { email, password } = req.body.user;
  
  if (!isEmail(email)) return res.status(401).send(`This email won't work!`)
  if (password.length < 6) return res.status(401).send(`Your password is too short! It has to be at least six characters.`);

  try {
    const user = await UserModel.findOne({
      email: email.toLowerCase()
    }).select("+password");

    if (!user) return res.status(401).send(`Your credentials are invalid.`)
    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) return res.status(401).send(`Your credentials are invalid.`);

    const payload = { userId: user._id }
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '2d' },
      (error, token) => {
        if (error) throw error;
        res.status(200).json(token);
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send('Uh oh! Server error!');
  }
}

module.exports = { getUsernameAvailable, createUser, postLoginUser };