const UserModel = require('../models/UserModel');

const searchUsers = async (req, res) => {
  let { searchText } = req.params;

  if (!searchText) return res.status(401).send("No searchText given")

  try {
    const results = await UserModel.find({
      name: { $regex: searchText, $options: "i" },
    });
    res.status(200).json(results);
  } catch (error) {
    console.log("Search error at controllers/search", error);
    res.status(500).send('Server error at controller/search');
  }
};

module.exports = { searchUsers }